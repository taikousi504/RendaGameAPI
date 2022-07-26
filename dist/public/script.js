$(function(){
    $('#btn1').click(function(){
        $.post("https://renda-game.herokuapp.com/users/login", {
            "name": "kousi",
            "password": "kousi504"
        }, function(data){
            $.ajax({
                url: 'https://renda-game.herokuapp.com/rendagame',
                type: 'get',
                headers: {
                    'access-token': data.access_token,
                },
            }).done(function(json){
                var text = ""
    ;               for (var i = 0; i < json.length; i++){
                        text += ("Score[" + i + "].score:" + json[i].score + "<br>");
                    }
                    $('#p1').html(text);
            });
        });
    });
});
