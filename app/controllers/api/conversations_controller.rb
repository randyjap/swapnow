class Api::ConversationsController < ApplicationController
  def index
    user = fb_auth_user(params[:access_token])
    user_id = user.fb_id

    @conversations = user.conversations.where(archived: false).as_json

    @conversations.each_with_index do |conversation, idx|
      other_user_id = conversation['conversation_id'].sub(user_id, '').sub('-','')
      @conversations[idx]['other_user_id'] = other_user_id
      @conversations[idx]['other_user_info'] = User.find_by(fb_id: other_user_id)
    end

    @conversations
  end

  def create
    conversations = Conversation.where(conversation_id: params[:conversation][:conversation_id])
    unless conversations.empty?
      conversations.update_all(archived: false)
      render json: ['already exists']
      return
    end

    @conversation = Conversation.new(conversation_params)
    if @conversation.save
      render json: ['success']
    else 
      render json: @conversation.errors.full_messages, status: 422
    end
  end

  def destroy
    @conversation = Conversation.find_by(conversation_id: params[:conversation_id], user_id: params[:user_id])
    @conversation.archived = true
    @conversation.save
    render json: ['success']
  end

  private

  def conversation_params 
    params.require(:conversation).permit(:conversation_id, :user_id, :archived)
  end
end
