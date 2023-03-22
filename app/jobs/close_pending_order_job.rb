class ClosePendingOrderJob < ApplicationJob
  queue_as :default

  def perform(order_id)
    order = Order.find(order_id)
    if order.present? && order.pending?
      order.closed!
    end
  end
end
