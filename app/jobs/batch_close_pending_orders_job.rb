class BatchClosePendingOrdersJob < ApplicationJob
  queue_as :default

  def perform
    orders = Order.pending
    orders.each do |order|
      order.closed!
    end
  end
end
