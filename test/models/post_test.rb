# == Schema Information
#
# Table name: posts
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  description :text             not null
#  price       :integer          not null
#  img_url1    :string           not null
#  img_url2    :string
#  category_id :integer          not null
#  course_id   :integer          not null
#  zip_code    :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  title       :string           not null
#  img_url3    :string
#  condition   :string           not null
#

require 'test_helper'

class PostTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
