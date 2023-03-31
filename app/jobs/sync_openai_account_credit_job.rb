class SyncOpenaiAccountCreditJob < ApplicationJob
  queue_as :default

  def perform
    accounts = OpenaiAccount.engaged
    accounts.find_each do |account|
      resp = OpenAi::CheckCreditService.new(account.secret_key).call
      account.update!(
        credit: resp.dig("total_granted"),
        used_amount: resp.dig("total_used"),
        total_available: resp.dig("total_available"),
      )
      sleep 1
    end
  end
end
