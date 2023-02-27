class AddMentionedUserIdsToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :mentioned_user_ids, :integer, array: true
  end
end
