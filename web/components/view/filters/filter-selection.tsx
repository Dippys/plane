import { FC } from "react";
import { Check } from "lucide-react";
import { observer } from "mobx-react-lite";
// hooks
import { useViewDetail } from "hooks/store";
// types
import { TViewFilters, TViewTypes } from "@plane/types";

type TViewFilterSelection = {
  workspaceSlug: string;
  projectId: string | undefined;
  viewId: string;
  viewType: TViewTypes;
  filterKey: keyof TViewFilters;
  propertyId: string;
};

export const ViewFilterSelection: FC<TViewFilterSelection> = observer((props) => {
  const { workspaceSlug, projectId, viewId, viewType, filterKey, propertyId } = props;

  const viewDetailStore = useViewDetail(workspaceSlug, projectId, viewId, viewType);

  const propertyIds = viewDetailStore?.appliedFilters?.filters?.[filterKey] || [];
  const isSelected = propertyIds?.includes(propertyId) || false;

  return (
    <div
      className={`flex-shrink-0 w-3 h-3 flex justify-center items-center border rounded text-bold ${
        isSelected
          ? "border-custom-primary-100 bg-custom-primary-100"
          : "border-custom-border-400 bg-custom-background-100"
      }`}
    >
      {isSelected && <Check size={14} />}
    </div>
  );
});