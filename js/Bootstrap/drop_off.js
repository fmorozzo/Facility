(function($){
    var $prodSelector = $('#products_options');
    var $productsContainer = $('#selected_product');
    
    $(document).ready(function(){
        
        var products = JSON.parse(window.atob(window.categoryProducts));
        window.productPrices = JSON.parse(window.atob(window.prices));

        updateProductList($prodSelector, $("#category").val(), products);

        $('#category').change(function(){
            var self = this;
            var $category = $(self).val();
            updateProductList($prodSelector, $category, products);
        });
        
        $prodSelector.change(function(){
            var $self = $(this);
            var productSrl = $self.val();
            var productName = $self.children(':selected').text();

            if(productSrl != '' && $($productsContainer).find('#product-'+productSrl).length==0) {
                var selectedProduct = '<div id="product-'+productSrl+'" class="selected_products clearfix">'+
                    '<input type="hidden" name="products[]" value="'+productSrl+'"/>'+
                    '<input type="hidden" name="product_names['+productSrl+']" value="'+productName+'"/>'+
                    '<span class="product-name"><span class="form-control">' + productName + '</span></span>' +
                    '<input type="number" class="product_quantity form-control" name="product_quantity['+productSrl+']" value="1"/>'+
                    '<span class="product_remove"><i class="fa fa-times" aria-hidden="true"></i></span>'+
                '</div>';

                $productsContainer.append(selectedProduct);
                updateProductsSummary();
            }
            $self.val("");
        });

        $productsContainer.on('click','.selected_products > .product_remove',function(){
           $(this).parent().remove();
           updateProductsSummary();
        })
        .on('focus' ,'.product_quantity', function(){
            if (isMobileDevice()) {
                this.select();
            }
        });

        $("#booking_date, #booking_time").on("change", function(){
          // get intervals
          getBookingIntervals();
          getBookableLockers();
          
          updateDateSummary();
        });
        
        updateProductsSummary();
        updateDateSummary();

        getBookingIntervals();
        getBookableLockers();
        
        $productsContainer.on("change", "input.product_quantity", updateProductsSummary);
        $( "#booking_date" ).datepicker( {
          dateFormat: "yy-mm-dd",
          minDate: 0,
          firstDay: 1
        } );
        $("#trigger-datepicker").on("click", function(){
          $( "#booking_date" ).datepicker("show");
        });
    });
    
    function getBookableLockers(){
      var $url = $("#lockers-wrapper").data("check");
      var $selected_date = $("#booking_date").val();
      // get lockers
      $.ajax({
        url: $url,
        context: document.body,
        data: {
          booking_date: $selected_date,
          locker: JSON.parse(window.selectedLockers)
        }
      }).done(function(data) {
        $("#lockers-wrapper").html(data);
      });
    }
    
    function getBookingIntervals() {
      if( $("#booking_date").size() > 0 ) {
        var $url = $("#booking_time").data("url");
        var $selected_date = $("#booking_date").val();
        $.ajax({
          url: $url,
          context: document.body,
          data: {
            booking_date: $selected_date
          },
        }).done(function(data) {
          var $options = "";
          $.each(data, function(index, value){
            $options += '<option value="' + value.key + '">' + value.value + '</option>';
          });
          $("#booking_time").html($options);
        });
      }
    }
    
    function updateProductList(selector, category, products) {
        if (selector === undefined) {
            return false;
        }

        if(category == null){
            category = -1;
        }

        selector.children().remove();
        var option = '<option value="">Please select</option>';
        for(var key in products[category]){
            option += '<option value="'+key+'">'+products[category][key]+'</option>';
        }

        selector.append(option);
        return true;
    }

    function isMobileDevice() {
        var isMobile = false; //initiate as false

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            isMobile = true;
        }

        return isMobile;
    }
    
    function calculateOrderTotal() {
      var orderTotal = 0;
      $.each( $("input[name='products[]']"), function (index, item){
        var itemSrl = $(item).val();
        orderTotal += $("input[name='product_quantity[" + itemSrl + "]']").val() * window.productPrices[itemSrl];
      } );
      return orderTotal;
    }
    function updateProductsSummary() {
      var $output = "<div class='panel panel-default'><div class='panel-body'>";
      $.each( $("input[name='products[]']"), function (index, item){
        var itemSrl = $(item).val();
        $output += "<p>" + $("input[name='product_quantity[" + itemSrl + "]']").val() + " x " + $("input[name='product_names[" + itemSrl + "]']").val() + "</p>\n"
      } );
      if( $("input[name='products[]']").size() == 0 ) {
        $output += $("#products-summary").data("empty");
      } else {
        var orderTotal = calculateOrderTotal();
        orderTotalOutput = orderTotal.toFixed(2).replace(".", ",");
        $output += "<hr />";
        $output += "<p>Total: &euro; " + orderTotalOutput + "</p>";
      }
      $output += "</div></div>";
      $("#products-summary").html($output);
    }
    
    function updateDateSummary() {
      var $output = "<div class='panel panel-default'><div class='panel-body'>";
      $output += '<i class="fa fa-calendar" aria-hidden="true"></i>' + " | " + $("#booking_date").val();
      if( $("option:selected", "#booking_time").size() > 0 && $("#booking_time").val() > 0 ) {
        $output += " | " + $("option:selected", "#booking_time").text();
      }
      $("#date-summary").html($output);
    }

})(jQuery);