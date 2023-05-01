class AddCounterCacheToModels < ActiveRecord::Migration[7.0]
  def change
    add_column :models, :likes_count, :integer, default: 0
    add_column :models, :stars_count, :integer, default: 0
  end
end
