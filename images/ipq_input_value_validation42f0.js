if (!String.prototype.getDecimals) {
	String.prototype.getDecimals = function() {
		var num = this,
			match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match)
			return 0;
		return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
	}
}

jQuery(document).ready( function($) {

	/*
	*	Quantity Rule Validation
	*	
	*	If user enters a value that is out of bounds, 
	*	it will be auto corrected to a valid value.
	*/	

	
	//transmit total price in cpf_product_price variable on onclick add to cart button
	document.querySelectorAll('*').forEach(function(node) {
		
			if (node.className.indexOf("single_add_to_cart_button")>-1) {
				//console.log(node.className);
				node.addEventListener("click", function(event)  {
					var totalPriceVal=0;
					document.querySelectorAll('*').forEach(function(node) {
						if (node.className.indexOf("price amount final")>-1) {
							var child=node.firstChild;
							totalPriceString=child.nodeValue;
							totalPriceVal = parseFloat(totalPriceString.substring(0,totalPriceString.lastIndexOf(String.fromCharCode(160))));
						}
					});
					if (document.getElementsByName("cpf_product_price").length>0) {
							document.getElementsByName("cpf_product_price")[0].value=totalPriceVal;
					}				
				});
			}
	});
	
	


});
