function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

$( "#loginForm" ).submit(function( event ) {
  event.preventDefault();

    const email = $(this).find('[name=email]').val()
    const password = $(this).find('[name=password]').val()

    $.ajax({
    type: "POST",
    url: "https://do-to-list-jee.herokuapp.com/api/login",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify({ email,password }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    statusCode: {
        200: function (res) {
            console.log('Success',res)
            localStorage.setItem('AuthToken', res.responseText)
            const userObj = parseJwt(res.responseText)
            userObj.role === 'ROLE_USER' ? window.location.replace("./tasks.html") : window.location.replace("./adminTasks.html")
        },
        401: function (res) {
             console.log('Error', res)
        alert( "Wrong email or password" );
        }
    }
    })

});