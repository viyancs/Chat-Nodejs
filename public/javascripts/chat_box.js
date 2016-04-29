
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        if (arg.color === null) {
            this.color = 0;
        } else {
            this.color = arg.color
        }
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                if (_this.color != 0) {
                    $message.addClass(_this.message_side).find('.avatar').attr('style','background-color:'+ _this.color+' !important;')
                }
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text,message_side,color) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            //message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side,
                color:color
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        /*setTimeout(function () {
            return sendMessage('Hi Sandy! How are you?','right');
        }, 1000);
        setTimeout(function () {
            return sendMessage('I\'m fine, thank you!','left');
        }, 2000);

sendMessage('Hello viyancs! :)','left');*/