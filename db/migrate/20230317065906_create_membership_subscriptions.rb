class CreateMembershipSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :membership_subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :membership_plan, null: false, foreign_key: true
      t.datetime :start_at
      t.datetime :end_at
      t.integer :status, null: false, default: 0, index: true

      t.timestamps
    end
  end
end
