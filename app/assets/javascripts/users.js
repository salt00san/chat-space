$(function () {
  function appendUser(user) {
    var html = `<div class="chat-group-user clearfix">
                      <p class="chat-group-user__name">${user.name}</p>
                      <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">
                      追加
                      </div>
                    </div>`;
    $("#user-search-result").append(html);
  }

  function NoUser() {
    var html = `<div class="chat-group-user clearfix">
                    <p class="chat-group-user__name">ユーザーが見つかりません</p>
                    </div>`;
    $("#user-search-result").append(html);
  }

  function AddChatGroup(user) {
    var html = `<div class="chat-group-user clearfix">
                    <input name="group[user_ids][]" type="hidden" value="${user.id}">
                    <p class="chat-group-user__name">${user.name}</p>
                    <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn">削除</div>
                    </div>`;
    $("#chat-group-users.js-add-user").append(html);
  }

  $("#user-search-field").on("keyup", function () {
    var input = $("#user-search-field").val();
    $.ajax({
        type: "GET",
        url: "/users",
        data: {
          keyword: input
        },
        dataType: "json"
      })
      .done(function (users) {
        var registeredUserIds = []
        var inputs = $('input[name="group[user_ids][]"]');
        for (var i = 0; i < inputs.length; i++) {
          registeredUserIds.push(Number(inputs[i].value))
        }
        $("#user-search-result").empty();
        if (users.length !== 0) {
          users.forEach(function (user) {
            if (registeredUserIds.indexOf(user.id) > -1) {
              return
            } else {
              appendUser(user);
            }
          });

        } else if (input.length == 0) {
          return false
        } else {
          NoUser();
        }
      })
      .fail(function () {
        alert('ユーザー検索に失敗しました');
      })
  });
  $(document).on("click", ".user-search-add.chat-group-user__btn--add", function () {
    var userid = $(this).attr("data-user-id");
    var username = $(this).attr("data-user-name");
    var UserData = {
      id: userid,
      name: username
    }
    $(this).parents('.chat-group-user').remove();
    AddChatGroup(UserData);
  });

  $(document).on("click", ".user-search-remove.chat-group-user__btn--remove", function () {
    $(this).parents('.chat-group-user').remove();
  });
});