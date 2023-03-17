class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :amount, precision: 10, scale: 2
      t.integer :status, default: 0, null: false, index: true
      t.references :owner, polymorphic: true, index: true
      t.json :data, default: {}

      t.timestamps
    end
  end
end
