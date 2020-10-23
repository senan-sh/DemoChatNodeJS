$(document).ready(() => {
    const socket = io()
    const my_user_id = $('#my_user_id').attr('data-id');
    let chat_token_jwt;
    socket.emit('add_sId_to_db', my_user_id);
    setInterval(() => {
        socket.emit('update_last_seen', my_user_id);
    }, 3000);
    socket.on("get_message", (body) => {
        if ($('.chat-messages').attr("data_chatmate_id") == body.id) {
            const li = document.createElement('li');
            li.classList.add('op-message');
            const now = new Date();
            const liHTML =
                `<li class="op-message">
                        <div>
                            <p>${body.message}<br>${now.toLocaleString()}</p>
                        </div>
                    </li>`;
            li.innerHTML = liHTML;
            const messages_ul = $('.chat-messages .conversation-messages ul')[0]
            messages_ul.append(li);
            messages_ul.scrollTop = messages_ul.scrollHeight
        }
    });
    socket.on("sent_message", (message) => {
        const li = document.createElement('li');
        li.classList.add('my-message');
        const now = new Date();
        const liHTML =
            `<div>
                 <p>${message}<br>${now.toLocaleString()}</p>
            </div>`;
        li.innerHTML = liHTML;
        const messages_ul = $('.chat-messages .conversation-messages ul')[0]
        messages_ul.append(li);
        messages_ul.scrollTop = messages_ul.scrollHeight
    });
    $('#message_form').submit((e) => {
        e.preventDefault();
        const message = $('#message_text').val();
        $('#message_text').val('');
        socket.emit('send_message', { chat_token_jwt, message })
    });
    $('#search_user_btn').click(async () => {
        const search_inp_value = $("#search_user_inp").val()
        const response = await fetch(`/chat/search_user?email=${search_inp_value}`);
        if (response.status == 404) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'User not found! Try Again...',
            })
        } else {
            $('.chat-messages').show();
            $('.chat-messages').fadeOut();
            const { init_messages, chat_token, to } = await response.json();
            chat_token_jwt = chat_token;
            chat_on = true;
            $(".instruct-chat").remove();
            if (init_messages) {
                const messages_reversed = init_messages.reverse();
                let conv_html = '';
                for (const message of init_messages) {
                    let message_li = '';
                    const mesDate = new Date(message.createdAt);
                    if (message.from == my_user_id) {
                        message_li =
                            `<li class="my-message" data-message-id="${message._id}">
                                 <div>
                                    <p>${message.text}<br>${mesDate.toLocaleString()}</p>
                                </div>
                            </li> `
                    } else {
                        message_li =
                            `<li class="op-message" data-message-id="${message._id}">
                                <div>
                                    <p>${message.text}<br>${mesDate.toLocaleString()}</p>
                                </div>
                             </li> `
                    }
                    const li =
                        conv_html = conv_html + message_li;
                }
                $('.conversation-messages ul').html(conv_html);
                $('.chat-messages').attr('data_chatmate_id', to);
                $('.chat-messages div h1#chatmate_email').text(search_inp_value);
            }
        }
    })
    $(document).on("click", "div.conversation-messages ul li.my-message", (e) => {
        const id = e.target.closest('li.my-message').getAttribute('data-message-id');
        console.log(id);
        const modal =
            `<div id="myModal" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content">
                    <button id="delete_message" class="btn btn-danger">Delete message?</button>
                </div>
            </div>
        </div>`;
        $("body").append(modal);

        // $("#delete_message").click(() => {
        // })

        $('#myModal').modal()
    });
})