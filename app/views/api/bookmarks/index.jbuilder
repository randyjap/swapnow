json.array! @bookmarked_posts do |bookmarked_post|
  json.extract! bookmarked_post,
                :id,
                :user_id,
                :description,
                :price,
                :img_url1,
                :img_url2,
                :category_id,
                :course_id,
                :zip_code
end
