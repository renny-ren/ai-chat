class CreateReferrals < ActiveRecord::Migration[7.0]
  def change
    create_table :referrals do |t|
      t.references :referrer, foreign_key: { to_table: :users }, null: false
      t.references :invitee, foreign_key: { to_table: :users }, null: false
      t.integer :status, null: false, default: 0, index: true

      t.timestamps
    end
  end
end
