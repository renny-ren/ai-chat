class CreateOpenaiAccounts < ActiveRecord::Migration[7.0]
  def change
    create_table :openai_accounts do |t|
      t.references :user, foreign_key: true
      t.string :secret_key
      t.string :email
      t.string :password
      t.decimal :credit, precision: 6, scale: 2
      t.decimal :used_amount, precision: 6, scale: 2

      t.timestamps
    end
  end
end
