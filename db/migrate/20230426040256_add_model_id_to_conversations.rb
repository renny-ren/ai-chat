class AddModelIdToConversations < ActiveRecord::Migration[7.0]
  def change
    add_reference :conversations, :model, index: true
  end
end
