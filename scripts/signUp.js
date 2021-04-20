$( "#signupForm" ).submit(function( event ) {
    
  event.preventDefault();

    const email = $(this).find('[name=email]').val()
    const password = $(this).find('[name=password]').val()
//   $.post( "https://do-to-list-jee.herokuapp.com/api/register", function( data ) {
//   console.log(data)
// }).fail(function() {
//             alert( "Such email already exists" );
//   })

  $.ajax({
    type: "POST",
    url: "https://do-to-list-jee.herokuapp.com/api/register",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify({ email,password }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      alert( "Successfully registred!" );
      window.location.replace('/login.html')
    },
    error: function(errMsg) {
        console.log(errMsg)
        alert( "Such email already exists" );
    }
});

});