class ClosePendingOrderJob < ApplicationJob
  queue_as :default

  def perform
    orders = Order.pending
    orders.find_each do |order|
      order.closed!
    end
  end
end
