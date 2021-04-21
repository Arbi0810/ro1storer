(function($) {
	
    // add to cart modal
    var product_info = null;
    jQuery('body').bind('adding_to_cart', function( button, data , data2 ) {
        product_info = data;
        apus_product_id =  data.data('product_id');
    });

    jQuery('body').bind('added_to_cart', function( fragments, cart_hash ){
        if( apus_product_id ){
            var imgtodrag = $('[data-product-id="'+apus_product_id+'"] .image img').eq(0);
            if ( $(window).width() > 991 ) {
            	var cart =  $('#cart');
            } else {
            	var cart = $('.active-mobile .dropdown');
            }
            if (imgtodrag) {
                var imgclone = imgtodrag.clone()
                    .offset({
                    top: product_info.offset().top-imgtodrag.height(),
                    left: product_info.offset().left
                })
                .css({
                    'opacity': '0.8',
                        'position': 'absolute',
                        'height': '150px',
                        'width': 'auto',
                        'z-index': '100000'
                })
                .appendTo($('body'))
                .animate({
                    'top': cart.offset().top + 10,
                        'left': cart.offset().left + 10,
                        'width': 75,
                        'height': 75
                }, 1000);
            
              	setTimeout(function () {
              		$('.mini-cart', cart).click();
                    cart.stop().animate({'margin-left':10},100).animate( {'margin-left':-10}, 200 ).animate( {'margin-left':0}, 100);

                }, 1500);
            
                imgclone.animate({
                    'width': 0,
                    'height': 0
                }, function () {
                    $(this).detach()
                });
            }
            $("html, body").stop().animate({ scrollTop:  cart.offset().top-50  }, "slow");
        }
    });

	// Ajax QuickView
	jQuery(document).ready(function($){
		$('body').on( 'click', 'a.quickview', function (e) {
			e.preventDefault();
			var self = $(this);
			self.parent().parent().parent().addClass('loading');
		    var productslug = jQuery(this).data('productslug');
		    var url = vegan_ajax.ajaxurl + '?action=vegan_quickview_product&productslug=' + productslug;
		    
	    	jQuery.get(url,function(data,status){
		    	$.magnificPopup.open({
					mainClass: 'apus-mfp-zoom-in',
					items    : {
						src : data,
						type: 'inline'
					}
				});
				// variation
                if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
                    $( '.variations_form' ).each( function() {
                        $( this ).wc_variation_form().find('.variations select:eq(0)').change();
                    });
                }
                var config = {
                    loop: false,
                    nav: true,
                    dots: false,
                    items: 1,
                    navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
                    responsive: {
	                    0:{
	                        items: 1
	                    },
	                    320:{
	                        items: 1
	                    },
	                    768:{
	                        items: 1
	                    },
	                    980:{
	                        items: 1
	                    },
	                    1280:{
	                        items: 1
	                    }
	                }
                };
                $(".quickview-owl").owlCarousel( config );
                
				self.parent().parent().parent().removeClass('loading');
		    });
		});
	});
	
	// thumb image
	$('.thumbnails-image-carousel .thumb-link, .lite-carousel-play .thumb-link').each(function(e){
		$(this).click(function(event){
			event.preventDefault();
			$('.main-image-carousel').trigger("to.owl.carousel", [e, 0, true]);
			
			$('.thumbnails-image-carousel .thumb-link').removeClass('active');
			$(this).addClass('active');
			return false;
		});
	});
	$('.main-image-carousel').on('changed.owl.carousel', function(event) {
		setTimeout(function(){
			var index = 0;
			$('.main-image-carousel .owl-item').each(function(i){
				if ($(this).hasClass('active')){
					index = i;
				}
			});
			$('.thumbnails-image-carousel .thumb-link').removeClass('active');
			
			if ( $('.thumbnails-image-carousel .lite-carousel-play').length > 0 ) {
				$('.thumbnails-image-carousel li').eq(index).find('.thumb-link').addClass('active');
			} else {
				$('.thumbnails-image-carousel .owl-item').eq(index).find('.thumb-link').addClass('active');
			}
		},50);
    });

	// change thumb variants
	$( 'body' ).on( 'found_variation', function( event, variation ) {
    	if ( variation && variation.image && variation.image.src && variation.image.src.length > 1 ) {
    		$('.main-image-carousel .owl-item').each(function(i){
    			var src = $('img', $(this)).attr('src');
    			if (src === variation.image.src) {
    				$('.main-image-carousel').trigger("to.owl.carousel", [i, 0, true]);
    			}
    		});
    	}
	});
	
	// sticky
	if ($('.product-version-v2 .sticky-this').length > 0) {
		$('.product-version-v2 .sticky-this').stick_in_parent({
	    	parent: ".product-v-wrapper",
	    	spacer: false
	  	});
	}


	// woofilter
	var apusFilter = {
		init: function(){
			$('.apus-shop-header').on('click', '#apus-categories a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'));
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .widget_product_categories a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'));
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .widget_layered_nav a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'));
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .widget_layered_nav_filters a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'));
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .widget_price_filter a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'));
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .apus_widget_product_sorting a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'));
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .widget_product_tag_cloud a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'), false, true);
			});
			$('.apus-shop-header').on('click', '#apus-sidebar .widget_orderby a', function(e) {
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'), false, true);
			});
			$('body').on('click', '.apus-results a', function(e){
				e.preventDefault();
				apusFilter.shopGetPage($(this).attr('href'), false, true);
			});

			// ajax pagination
			if ( $('.ajax-pagination').length ) {
				apusFilter.ajaxPaginationLoad();
			}
			//apusFilter.shopLoadImages();

			// filter action
			$('body').on('click', '#apus-filter-menu .filter-action', function(e) {
				e.preventDefault();
				$('.apus-sidebar-header').slideToggle(300);
				if ( $(this).find('i').hasClass('mn-icon-64') ) {
					$(this).find('i').removeClass('mn-icon-64').addClass('mn-icon-4');
				} else {
					$(this).find('i').removeClass('mn-icon-4').addClass('mn-icon-64');
				}
				if ($('.apus-shop-header').hasClass('filter-active')) {
					$('.apus-shop-header').removeClass('filter-active');
				} else {
					$('.apus-shop-header').addClass('filter-active');
				}
			});
			$('body').on('click', '.categories-action', function(e) {
				e.preventDefault();
				$('.apus-categories-wrapper').toggleClass('show');
				$('.apus-categories-wrapper').perfectScrollbar('update');
			});
		},
		shopGetPage: function(pageUrl, isBackButton, isProductTag){
			var self = this;
			if (self.shopAjax) { return false; }
			
			if (pageUrl) {
				// Remove any visible shop notices
				//self.shopRemoveNotices();												
				
				// Set current shop URL (used to reset search and product-tag AJAX results)
				self.shopSetCurrentUrl(isProductTag);
				
				// Show 'loader' overlay
				self.shopShowLoader();
				
				// Make sure the URL has a trailing-slash before query args (301 redirect fix)
				pageUrl = pageUrl.replace(/\/?(\?|#|$)/, '/$1');
				
				// Set browser history "pushState" (if not back button "popstate" event)
				if (!isBackButton) {
					self.setPushState(pageUrl);
				}
				
				self.shopAjax = $.ajax({
					url: pageUrl,
					data: {
						load_type: 'full'
					},
					dataType: 'html',
					cache: false,
					headers: {'cache-control': 'no-cache'},
					
					method: 'POST', // Note: Using "POST" method for the Ajax request to avoid "load_type" query-string in pagination links
					
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log('NM: AJAX error - shopGetPage() - ' + errorThrown);
						
						// Hide 'loader' overlay (after scroll animation)
						self.shopHideLoader();
						
						self.shopAjax = false;
					},
					success: function(response) {
						// Update shop content
						self.shopUpdateContent(response);
						
						self.shopAjax = false;
					}
				});
				
			}
		},
		shopHideLoader: function(){
			$('body').find('#apus-shop-products-wrapper').removeClass('loading');
		},
		shopShowLoader: function(){
			$('body').find('#apus-shop-products-wrapper').addClass('loading');
		},
		setPushState: function(pageUrl) {
			window.history.pushState({apusShop: true}, '', pageUrl);
		},
		shopSetCurrentUrl: function(isProductTag) {
			var self = this;
			
			// Exclude product-tag page URL's
			if (!self.isProductTagUrl) {
				// Set current page URL
				self.searchAndTagsResetURL = window.location.href;
			}
			
			// Is the current URL a product-tag URL?
			self.isProductTagUrl = (isProductTag) ? true : false;
		},
		/**
		 *	Shop: Update shop content with AJAX HTML
		 */
		shopUpdateContent: function(ajaxHTML) {
			var self = this,
				$ajaxHTML = $('<div>' + ajaxHTML + '</div>'); // Wrap the returned HTML string in a dummy 'div' element we can get the elements
			
			// Page title - wp_title()
			var wpTitle = $ajaxHTML.find('#apus-wp-title').text();
			if (wpTitle.length) {
				// Update document/page title
				document.title = wpTitle;
			}
			
			// Extract elements
			var $categories = $ajaxHTML.find('#apus-categories'),
				$sidebar = $ajaxHTML.find('#apus-sidebar'),
				$shop = $ajaxHTML.find('#apus-shop-products-wrapper');
											
			// Prepare/replace categories
			if ($categories.length) { 
				var $shopCategories = $('#apus-categories');
				
				// Is the category menu open? -add 'force-show' class
				if ($shopCategories.hasClass('fade-in')) {
					$categories.addClass('fade-in force-show');
				}
				
				$shopCategories.replaceWith($categories); 
			}
			// Prepare/replace sidebar filters
			if ($sidebar.length) {
				var $shopSidebar = $('#apus-sidebar');
				
				// Header sidebar: Is the sidebar open? -add 'force-show' class
				if ($shopSidebar.hasClass('fade-in')) {
					$sidebar.addClass('fade-in force-show');
				
					$shopSidebar.replaceWith($sidebar);
					
					// Header sidebar: Instantiate filter/widget scrollbars
					if (self.filterScrollbars) {
						self.filterScrollbarsInit();
					}
				} else {
					$shopSidebar.replaceWith($sidebar);
					
					// Header sidebar: Sidebar is hidden, instantiate filter/widget scrollbars when "filter" link is clicked instead
					self.filterScrollbarsLoaded = false;
				}
			}
			
			// Replace shop
			if ($shop.length) {
				$('#apus-shop-products-wrapper').replaceWith($shop);
			}

			// Load images (init Unveil)
			self.shopLoadImages();
			
			
			// if (!self.shopInfLoadBound) {	
			// 	// Bind "infinite load" if enabled (initial shop page didn't have pagination)
			// 	self.infload_init();
			// }
			
			
			// Smooth-scroll to top
			//var to = self.shopMaybeScrollToTop();
			setTimeout(function() {
				// Hide 'loader' overlay (after scroll animation)
				self.shopHideLoader();
			}, 100);
		},

		/**
		 *	Shop: Initialize infinite load
		 */
		ajaxPaginationLoad: function() {
			var self = this,
				$infloadControls = $('.ajax-pagination'),					
				nextPageUrl;
			
			
			// Used to check if "infload" needs to be initialized after Ajax page load
			self.shopInfLoadBound = true;
			
			
			self.infloadScroll = ($infloadControls.hasClass('infinite-action')) ? true : false;
			
			if (self.infloadScroll) {
				self.infscrollLock = false;
				
				var pxFromWindowBottomToBottom,
					pxFromMenuToBottom = Math.round($(document).height() - $infloadControls.offset().top);
					//bufferPx = 0;
				
				/* Bind: Window resize event to re-calculate the 'pxFromMenuToBottom' value (so the items load at the correct scroll-position) */
				var to = null;
				$(window).resize(function() {
					if (to) { clearTimeout(to); }
					to = setTimeout(function() {
						var $infloadControls = self.$shopBrowseWrap.children('.apus-pagination'); // Note: Don't cache, element is dynamic
						pxFromMenuToBottom = Math.round($(document).height() - $infloadControls.offset().top);
					}, 100);
				});
				
				$(window).scroll(function(){
					if (self.infscrollLock) {
						return;
					}
					
					pxFromWindowBottomToBottom = 0 + $(document).height() - ($(window).scrollTop()) - $(window).height();
					
					// If distance remaining in the scroll (including buffer) is less than the pagination element to bottom:
					if ((pxFromWindowBottomToBottom/* - bufferPx*/) < pxFromMenuToBottom) {
						self.ajaxPaginationGet();
					}
				});
			} else {
				var $productsWrap = $('body');
				
				/* Bind: "Load" button */
				$productsWrap.on('click', '#apus-shop-products-wrapper .apus-loadmore-btn', function(e) {
					e.preventDefault();
					self.ajaxPaginationGet();
				});
			}
			
			if (self.infloadScroll) {
				$(window).trigger('scroll'); // Trigger scroll in case the pagination element (+buffer) is above the window bottom
			}
		},
		/**
		 *	Shop: AJAX load next page
		 */
		ajaxPaginationGet: function() {
			var self = this;
			
			if (self.shopAjax) return false;
			
			// Remove any visible shop notices
			//self.shopRemoveNotices();
			
			// Get elements (these can be replaced with AJAX, don't pre-cache)
			var $nextPageLink = $('.apus-pagination-next-link').find('a'),
				$infloadControls = $('.ajax-pagination'),
				nextPageUrl = $nextPageLink.attr('href');
			
			if (nextPageUrl) {
				//nextPageUrl = self.updateUrlParameter(nextPageUrl, 'load_type', 'products');
				
				// Show 'loader'
				$infloadControls.addClass('apus-loader');
				
				self.shopAjax = $.ajax({
					url: nextPageUrl,
					data: {
						load_type: 'products'
					},
					dataType: 'html',
					cache: false,
					headers: {'cache-control': 'no-cache'},
					method: 'GET',
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log('APUS: AJAX error - ajaxPaginationGet() - ' + errorThrown);
					},
					complete: function() {
						// Hide 'loader'
						$infloadControls.removeClass('apus-loader');
					},
					success: function(response) {
						var $response = $('<div>' + response + '</div>'), // Wrap the returned HTML string in a dummy 'div' element we can get the elements
							$newElements = $response.children('.apus-products');
						
						// Append the new elements
						$('.apus-shop-products-wrapper .products .row').append($newElements);
						
						// Load images (init Unveil)
						self.shopLoadImages();
						
						// Get the 'next page' URL
						nextPageUrl = $response.find('.apus-pagination-next-link').children('a').attr('href');
						
						if (nextPageUrl) {
                            $nextPageLink.attr('href', nextPageUrl);
                        } else {
                            $('.apus-shop-products-wrapper').addClass('all-products-loaded');
                            
                            if (self.infloadScroll) {
                                self.infscrollLock = true; // "Lock" scroll (no more products/pages)
                            }
                            $infloadControls.find('.apus-loadmore-btn').addClass('hidden');
                            $nextPageLink.removeAttr('href');
                        }
						
						self.shopAjax = false;
						
						if (self.infloadScroll) {
							$(window).trigger('scroll'); // Trigger 'scroll' in case the pagination element (+buffer) is still above the window bottom
						}
					}
				});
			} else {
				if (self.infloadScroll) {
					self.infscrollLock = true; // "Lock" scroll (no more products/pages)
				}
			}
		},

		shopLoadImages: function() {
			var self = this;
			
			// Remove any previous Unveil events
			$(window).off('scroll.unveil resize.unveil lookup.unveil');
							
			var $images = $('body').find('.product-image:not(.image-loaded) .unveil-image'); // Get un-loaded images only
			
			if ($images.length) {
				var scrollTolerance = 1;
				$images.unveil(scrollTolerance, function() {
					$(this).parents('.product-image').first().addClass('image-loaded');
				});
			}
			
		},
	};

	apusFilter.init();
})(jQuery)