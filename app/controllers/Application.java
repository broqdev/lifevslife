package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

    public static Result seed() {
    	return ok(seed.render());
    }

}
