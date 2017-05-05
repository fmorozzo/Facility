(function($){
  $(document).ready(function(){
    $("a.login-link, a.register-link, a.reset-password-link").on("click", initAjaxLinks);
    $("#modal-wrapper").on("click", "a.login-link, a.register-link, a.reset-password-link", initAjaxLinks);
    
    $('#login').click(function(){
        $('#loginModal').modal('show');
    });
    $('#loginModal').on('shown.bs.modal', function () {
        $('#username').focus();
    });
    
    $("#modal-wrapper").on("submit", "form#login-form", function(e){
      e.preventDefault();
      var $url = $(this).attr("action");
      var $tok = $(this).find("input[name=_token]").val();
      var $email = $(this).find("#email_address").val();
      var $pass = $(this).find("#password").val();
      $.ajax({
          type: "POST",
          url: $url,
          dataType: "json",
          data: {'email_address': $email, 'password': $pass, '_token': $tok}
      }).done(function( msg, textStatus, jqXHR ) {
        if(msg.redirect) {
          window.location.href = msg.redirect;
        } else {
          $("#ajax-errors-wrapper").html('<div class="alert alert-danger"><p>Error occured.</p></div>');
        }
      }).fail(function( msg ) {
        var errors = $.parseJSON(msg.responseText);
        var errors_html = "";
        for (var error in errors) {
          errors_html += '<p>' + errors[error] + '</p>';
        }
        $("#ajax-errors-wrapper").html('<div class="alert alert-danger">' + errors_html + '</div>');
      });
    });
    
    $("#modal-wrapper").on("submit", "form#reset-password-form", function(e){
      e.preventDefault();
      var $url = $(this).attr("action");
      var $tok = $(this).find("input[name=_token]").val();
      var $email = $(this).find("#email_address").val();
      $.ajax({
          type: "POST",
          url: $url,
          dataType: "json",
          data: {'email_address': $email, '_token': $tok}
      }).done(function( msg, textStatus, jqXHR ) {
        if(msg.message) {
          $("#ajax-errors-wrapper").html('<div class="alert alert-success"><p>' + msg.message + '</p></div>');
        } else {
          $("#ajax-errors-wrapper").html('<div class="alert alert-danger"><p>Error occured.</p></div>');
        }
      }).fail(function( msg ) {
        var errors = $.parseJSON(msg.responseText);
        var errors_html = "";
        for (var error in errors) {
          errors_html += '<p>' + errors[error] + '</p>';
        }
        $("#ajax-errors-wrapper").html('<div class="alert alert-danger">' + errors_html + '</div>');
      }).always(function(){
        $(".modal").scrollTop(1);
      });
    });
    
    $("#modal-wrapper").on("submit", "form#register-form", function(e){
      e.preventDefault();
      var $url = $(this).attr("action");
      var $tok = $(this).find("input[name=_token]").val();
      var $email = $(this).find("#email_address").val();
      var $title = $(this).find("#title").val();
      var $first_name = $(this).find("#first_name").val();
      var $last_name = $(this).find("#last_name").val();
      var $phone_prefix = $(this).find("#phone_prefix").val();
      var $phone_number = $(this).find("#phone_number").val();
      var $password = $(this).find("#password").val();
      var $password_confirmation = $(this).find("#password_confirmation").val();
      $.ajax({
          type: "POST",
          url: $url,
          dataType: "json",
          data: {email_address: $email, _token: $tok, title: $title, first_name: $first_name, last_name: $last_name, phone_prefix: $phone_prefix, phone_number: $phone_number, password: $password, password_confirmation: $password_confirmation}
      }).done(function( msg, textStatus, jqXHR ) {
        if(msg.redirect) {
          window.location.href = msg.redirect;
        } else {
          alert("Error occured.")
        }
      }).fail(function( msg ) {
        var errors = $.parseJSON(msg.responseText);
        var errors_html = "";
        for (var error in errors) {
          errors_html += '<p>' + errors[error] + '</p>';
        }
        $("#ajax-errors-wrapper").html('<div class="alert alert-danger">' + errors_html + '</div>');
      }).always(function(){
        $(".modal").scrollTop(1);
      });
    });
    $("#show-register-form-link").click(function(e){
      e.preventDefault();
      $(this).hide();
      $("#register-form").show();
    });
  });
  
  function initAjaxLinks(e) {
    e.preventDefault();
    var $url = $(this).attr("href");
    var $spinner = '<div class="modal-content text-center" style="padding: 2em;"><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i></div>';
    $("#modal-wrapper > .modal-dialog").html($spinner);
    $("#modal-wrapper").modal();
    $("#modal-wrapper > .modal-dialog").load($url + " #main-page-content > div", function(){ 
      $("#show-register-form-link").click(function(e){
        e.preventDefault();
        $(this).hide();
        $("#register-form").show();
      });
    });
  }
  
  
})(jQuery);