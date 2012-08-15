YUI.namespace('Y.Modernizr');
YUI.add('trip-modernizr' , function(Y){
/*!  
 * Modernizr JavaScript library 1.2
 * http://modernizr.com/
 *
 * Copyright (c) 2009-2010 Faruk Ates - http://farukat.es/
 * Dual-licensed under the BSD and MIT licenses.
 * http://modernizr.com/license/
 * 
 * Featuring major contributions by
 * Paul Irish  - http://paulirish.com
 */
/*
 * Modernizr is a script that will detect native CSS3 and HTML5 features
 * available in the current UA and provide an object containing all
 * features with a true/false value, depending on whether the UA has
 * native support for it or not.
 *
 * In addition to that, Modernizr will add classes to the <html>
 * element of the page, one for each cutting-edge feature. If the UA
 * supports it, a class like "cssgradients" will be added. If not,
 * the class name will be "no-cssgradients". This allows for simple
 * if-conditionals in CSS styling, making it easily to have fine
 * control over the look and feel of your website.
 *
 * @author        Faruk Ates
 * @copyright     (c) 2009-2010 Faruk Ates.
 *
 * @contributor   Paul Irish
 * @contributor   Ben Alman
 */

	Y.Modernizr = {
		input : {}
	};
	if( "placeholder" in document.createElement("input")){
         Y.Modernizr.input.placeholder = true ;
    }else{
		 Y.Modernizr.input.placeholder = false ;
	}
},'',{requires:['node-base']});
