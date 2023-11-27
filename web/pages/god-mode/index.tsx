import { ReactElement } from "react";
import useSWR from "swr";
import { observer } from "mobx-react-lite";
// layouts
import { InstanceAdminLayout } from "layouts/admin-layout";
// types
import { NextPageWithLayout } from "types/app";
// store
import { useMobxStore } from "lib/mobx/store-provider";
// ui
import { Loader } from "@plane/ui";
// components
import { InstanceGeneralForm } from "components/instance";

const InstanceAdminPage: NextPageWithLayout = observer(() => {
  // store
  const {
    instance: { fetchInstanceInfo, instance, fetchInstanceAdmins, instanceAdmins },
  } = useMobxStore();

  useSWR("INSTANCE_INFO", () => fetchInstanceInfo());
  useSWR("INSTANCE_ADMINS", () => fetchInstanceAdmins());

  return (
    <div className="flex flex-col gap-8 h-full w-full">
      <div className="pb-3 mb-2 border-b border-custom-border-100">
        <div className="text-custom-text-100 font-medium text-xl pb-1">ID your instance easily</div>
        <div className="text-custom-text-300 font-normal text-sm">
          Change the name of your instance and instance admin e-mail addresses. If you have a paid subscription, you
          will find your license key here.
        </div>
      </div>
      {instance && instanceAdmins ? (
        <InstanceGeneralForm instance={instance} instanceAdmins={instanceAdmins} />
      ) : (
        <Loader className="space-y-4">
          <Loader.Item height="50px" />
          <Loader.Item height="50px" width="50%" />
          <Loader.Item height="50px" width="25%" />
        </Loader>
      )}
    </div>
  );
});

InstanceAdminPage.getLayout = function getLayout(page: ReactElement) {
  return <InstanceAdminLayout>{page}</InstanceAdminLayout>;
};

export default InstanceAdminPage;