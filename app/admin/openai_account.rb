ActiveAdmin.register OpenaiAccount do
  index do
    selectable_column
    id_column
    column :user_id do |item|
      if item.user_id
        link_to item.user_id, admin_user_path(item.user_id)
      end
    end
    column :email
    column :credit
    column :used_amount
    column :total_available
    column :created_at
    actions
  end

  filter :id
  filter :user_id
  filter :email
  filter :credit
  filter :used_amount
  filter :total_available

  form do |f|
    f.inputs do
      f.input :user_id
      f.input :secret_key
      f.input :credit
      f.input :used_amount
      f.input :total_available
    end
    f.actions
  end

  controller do
    def update
      account = OpenaiAccount.find(params[:id])
      account.update!(openai_account_params)
      redirect_to admin_openai_accounts_path
    end

    private

    def openai_account_params
      params.require(:openai_account).permit(:user_id, :secret_key, :credit, :used_amount, :total_available)
    end
  end
end
