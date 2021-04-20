const token = localStorage.getItem('AuthToken')
token ? getUsers() : window.location.replace('./login.html')

userRole = parseJwt(token).role
if(userRole === 'ROLE_USER') window.location.replace('./tasks.html')

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getUsers(){
    
    const userList = $('#usersList')
    userList.empty()
    const parsedObject = parseJwt(token)
$.ajax({
    url: `https://do-to-list-jee.herokuapp.com/api/user`,
    // The key needs to match your method's input parameter (case-sensitive).
    headers: {
        'Authorization': `Bearer ${token}`
    },
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    statusCode: {
        200: function (res) {
            console.log('Success',res)
            res.map((item) => userList.append(createUserListItem(item)) )
        },
        401: function (res) {
             console.log('Error', res)
        }
    }
})
}

function onUserUpgrade(id){
    $.ajax({
    type: 'PATCH',
    url: `https://do-to-list-jee.herokuapp.com/api/user/${id}`,
    // The key needs to match your method's input parameter (case-sensitive).
    headers: {
        'Authorization': `Bearer ${token}`
    },
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({role: "ROLE_ADMIN"}),
    statusCode: {
        200: function (res) {
            console.log('Success',res)
            alert('Successfully updated user to admin status')
            getUsers()
        },
        401: function (res) {
             console.log('Error', res)
             alert('Error occurred during user status change')
        }
    }
    })
}

function onExit(){
    localStorage.removeItem('AuthToken')
    window.location.replace('login.html')
}

function onTasksPage(){
    window.location.replace('./adminTasks.html')
}

function onUserDelete(id) {
$.ajax({
    type: 'DELETE',
    url: `https://do-to-list-jee.herokuapp.com/api/user/${id}`,
    // The key needs to match your method's input parameter (case-sensitive).
    headers: {
        'Authorization': `Bearer ${token}`
    },
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    statusCode: {
        200: function (res) {
            console.log('Success',res)  
            $(`#user${id}`).remove()
            alert('Successfully deleted user')
        },
        401: function (res) {
             console.log('Error', res)
             alert('Error occurred during user status change')
        }
    }
    })
}


function createUserListItem(item){
    return `
        <li class="list-group-item" id="user${item.id}">
        <div class="row">
            <div class="col">
                ${item.email}
            </div>
            <div class="col">
                ${item.role === 'ROLE_USER' ? 'user' : 'admin'}
            </div>
            <div class="col-1">
            ${item.role === 'ROLE_USER' ? 
            `<div class="exit-button" onclick="onUserUpgrade(${item.id})">
                <img src="../media/up-arrow.svg" alt='upgrade' class="icon" />
            </div>` : ''}
            </div>
            <div class="col-1">
             ${item.role === 'ROLE_USER' ? 
                `<div class="exit-button" onclick="onUserDelete(${item.id})">
                    <img src="../media/trash.svg" alt='upgrade' class="icon" />
                </div>` : ''}
            </div>
        </div>
        </li>
    `
}