# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

every 6.hours do
  runner "ExpireMembershipJob.perform_now"
end

every 2.hours do
  runner "BatchClosePendingOrdersJob.perform_now"
end

# 接口被封，暂停使用
# every 1.day do
#   runner "SyncOpenaiAccountCreditJob.perform_now"
# end
