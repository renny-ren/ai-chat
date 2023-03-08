class CreateSponsorships < ActiveRecord::Migration[7.0]
  def change
    create_table :sponsorships do |t|
      t.references :user, foreign_key: true
      t.decimal :amount, precision: 10, scale: 2
      t.boolean :anonymous, default: false

      t.timestamps
    end
  end
end
