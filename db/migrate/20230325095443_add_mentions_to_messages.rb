class AddMentionsToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :mentions, :string, array: true
  end
end
