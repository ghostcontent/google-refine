function ReconDialog(column, types) {
    this._column = column;
    this._types = types;
    this._createDialog();
}

ReconDialog.prototype._createDialog = function() {
    var self = this;
    var frame = DialogSystem.createDialog();
    frame.width("400px");
    
    var header = $('<div></div>').addClass("dialog-header").text("Reconcile column " + this._column.headerLabel).appendTo(frame);
    var body = $('<div></div>').addClass("dialog-body").appendTo(frame);
    var footer = $('<div></div>').addClass("dialog-footer").appendTo(frame);
    
    $('<p></p>').text("Reconcile cell values to topics of type:").appendTo(body);
    
    if (this._types.length > 0) {
        var createTypeChoice = function(type) {
            var div = $('<div>').appendTo(body);
            $('<input type="radio" name="recon-dialog-type-choice">')
                .attr("value", type.id)
                .appendTo(div);
                
            $('<span></span>').text(" " + type.name).appendTo(div);
            $('<span></span>').text(" (" + type.id + ")").appendTo(div);
        };
        for (var i = 0; i < this._types.length && i < 7; i++) {
            createTypeChoice(this._types[i]);
        }
        
        var divCustom = $('<div>').appendTo(body);
        $('<input type="radio" name="recon-dialog-type-choice">')
            .attr("value", "")
            .appendTo(divCustom);
            
        $('<span></span>').text(" Other:").appendTo(divCustom);
    }
    
    var type = null;
    var input = $('<input />').appendTo($('<p></p>').appendTo(body));
    input.suggest({ type : '/type/type' }).bind("fb-select", function(e, data) {
        type = data.id;
        $('input[name="recon-dialog-type-choice"][value=""]').attr("checked", "true");
    });
    
    $('<button></button>').text("Start Reconciling").click(function() {
        var choices = $('input[name="recon-dialog-type-choice"]:checked');
        if (choices != null && choices.length > 0 && choices[0].value != "") {
            type = choices[0].value;
        }
        
        if (type == null)  {
            alert("Please specify a type.");
        } else {
            DialogSystem.dismissUntil(level - 1);
            $.post(
                "/command/reconcile?" + $.param({ project: theProject.id, columnName: self._column.headerLabel, type: type }), 
                { engine: JSON.stringify(ui.browsingEngine.getJSON()) },
                function(data) {
                    if (data.code != "error") {
                        ui.processWidget.update();
                    } else {
                        alert(data.message);
                    }
                },
                "json"
            );
        }
    }).appendTo(footer);
    
    $('<button></button>').text("Cancel").click(function() {
        DialogSystem.dismissUntil(level - 1);
    }).appendTo(footer);
    
    var level = DialogSystem.showDialog(frame);
    
    input[0].focus();
};

