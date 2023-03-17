class CreateMembershipPlans < ActiveRecord::Migration[7.0]
  def change
    create_table :membership_plans do |t|
      t.string :name, null: false
      t.string :description
      t.decimal :amount, precision: 10, scale: 2
      t.integer :duration, default: 0

      t.timestamps
    end
  end
end
