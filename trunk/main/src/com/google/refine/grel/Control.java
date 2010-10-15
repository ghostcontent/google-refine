package com.google.refine.grel;

import java.util.Properties;

import com.google.refine.Jsonizable;
import com.google.refine.expr.Evaluable;

/**
 * Interface of GREL controls such as if, forEach, forNonBlank, with. A control can
 * decide which part of the code to execute and can affect the environment bindings.
 * Functions, on the other hand, can't do either.
 */
public interface Control extends Jsonizable {
    public Object call(Properties bindings, Evaluable[] args);
    
    public String checkArguments(Evaluable[] args);
}