class AddConversationIdToMessages < ActiveRecord::Migration[7.0]
  def change
    add_reference :messages, :conversation, index: true
    add_column :messages, :role, :integer, null: false, default: 0
  end
end
