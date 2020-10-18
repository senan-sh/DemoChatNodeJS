let chat_on;
$(document).ready(() => {
    $('.logsp a').click(function (e) {
        e.preventDefault();
        if ($('.register-form').hasClass('active')) {
            $('.register-form').removeClass('active')
            $('.register-form').slideUp()
        }
        $('.login-form').slideDown()
        $('.login-form').addClass('active')
    });
    $('.regsp a').click(function (e) {
        e.preventDefault();
        if ($('.login-form').hasClass('active')) {
            $('.login-form').removeClass('active')
            $('.login-form').slideUp()
        }
        $('.register-form').slideDown()
        $('.register-form').addClass('active')
    });
    const left_panel_btn = $('.left-bar svg')
    left_panel_btn.click(function () {
        if (left_panel_btn.hasClass('active')) {
            $('.start-conversation').hide()
            if (chat_on) {
                $('.chat-container div.chat-messages').fadeIn();
                $('.chat-container div.chat-messages').css('display','grid');
            } else {
                $('.chat-container div.instruct-chat').fadeIn();
            }
        } else {
            $('.start-conversation').fadeIn()
            if (chat_on) {
                $('.chat-container div.chat-messages').hide();
            } else {
                $('.chat-container div.instruct-chat').hide();
            }
        }
        $('.chat-container').toggleClass('active');
        left_panel_btn.toggleClass('active');
    })
})