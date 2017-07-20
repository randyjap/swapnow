# == Schema Information
#
# Table name: users
#
#  id                      :integer          not null, primary key
#  fb_id                   :string           not null
#  edu_email_confirmed     :boolean          default(FALSE)
#  edu_email_confirm_token :string
#  fb_email                :string
#  edu_email               :string
#  university_id           :integer
#  marketing_opt_in        :boolean          default(TRUE), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  first_name              :string
#  last_name               :string
#  fb_picture              :string
#

class User < ApplicationRecord
  validates :fb_id, :marketing_opt_in, presence: true
  validates :edu_email, uniqueness: true, allow_nil: true
  validates_uniqueness_of :fb_id, case_sensitive: false
  has_many :posts
  has_many :bookmarks
  has_many :bookmarked_posts, through: :bookmarks, source: :post
  has_many :rfps
  belongs_to :university, optional: true
  has_many :users_courses, inverse_of: :user
  has_many :courses, through: :users_courses
  has_many :course_posts, through: :users_courses, source: :posts

  has_many :conversations, foreign_key: :user_id, class_name: :Conversation, primary_key: :fb_id

  before_create :confirmation_token

  def email_activate
    self.edu_email_confirmed = true
    self.edu_email_confirm_token = nil
    save!(validate: false)
  end

  def mail
    UserMailer.registration_confirmation(self).deliver
  end
  #
  # TODO: testing delayed job
  # handle_asynchronously :mail,
  #                       run_at: Proc.new { 5.seconds.from_now }

  private

  def confirmation_token
    if self.edu_email_confirm_token.blank?
      self.edu_email_confirm_token = SecureRandom.urlsafe_base64.to_s
    end
  end
end
