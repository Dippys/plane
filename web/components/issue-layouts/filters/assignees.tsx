import React, { useState } from "react";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { FilterHeader, FilterOption } from "components/issue-layouts";
// ui
import { Avatar, Loader } from "components/ui";

type Props = { workspaceSlug: string; projectId: string; itemsToRender: number };

export const FilterAssignees: React.FC<Props> = observer((props) => {
  const { workspaceSlug, projectId, itemsToRender } = props;

  const [previewEnabled, setPreviewEnabled] = useState(true);

  const store = useMobxStore();
  const { issueFilter: issueFilterStore, project: projectStore } = store;

  const handleUpdateAssignees = (value: string) => {
    const newValues = issueFilterStore.userFilters?.assignees ?? [];

    if (issueFilterStore.userFilters?.assignees?.includes(value)) newValues.splice(newValues.indexOf(value), 1);
    else newValues.push(value);

    issueFilterStore.updateUserFilters(workspaceSlug.toString(), projectId.toString(), {
      filters: {
        assignees: newValues,
      },
    });
  };

  const appliedFiltersCount = issueFilterStore.userFilters?.assignees?.length ?? 0;

  const filteredOptions = projectStore.members?.[projectId?.toString() ?? ""]?.filter((member) =>
    member.member.display_name.toLowerCase().includes(issueFilterStore.filtersSearchQuery.toLowerCase())
  );

  return (
    <>
      <FilterHeader
        title={`Assignee${appliedFiltersCount > 0 ? ` (${appliedFiltersCount})` : ""}`}
        isPreviewEnabled={previewEnabled}
        handleIsPreviewEnabled={() => setPreviewEnabled(!previewEnabled)}
      />
      {previewEnabled && (
        <div>
          {filteredOptions ? (
            filteredOptions.length > 0 ? (
              filteredOptions
                .slice(0, itemsToRender)
                .map((member) => (
                  <FilterOption
                    key={`assignees-${member?.member?.id}`}
                    isChecked={
                      issueFilterStore?.userFilters?.assignees != null &&
                      issueFilterStore?.userFilters?.assignees.includes(member.member?.id)
                        ? true
                        : false
                    }
                    onClick={() => handleUpdateAssignees(member.member?.id)}
                    icon={<Avatar user={member.member} height="18px" width="18px" />}
                    title={member.member?.display_name}
                  />
                ))
            ) : (
              <p className="text-xs text-custom-text-400 italic">No matches found</p>
            )
          ) : (
            <Loader className="space-y-2">
              <Loader.Item height="20px" />
              <Loader.Item height="20px" />
              <Loader.Item height="20px" />
            </Loader>
          )}
        </div>
      )}
    </>
  );
});