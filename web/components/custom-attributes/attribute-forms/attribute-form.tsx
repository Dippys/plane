import { useEffect } from "react";

// headless ui
import { Disclosure } from "@headlessui/react";
// react-hook-form
import { Control, Controller, UseFormWatch, useForm } from "react-hook-form";
// components
import {
  CheckboxAttributeForm,
  DateTimeAttributeForm,
  EmailAttributeForm,
  FileAttributeForm,
  NumberAttributeForm,
  RelationAttributeForm,
  SelectAttributeForm,
  TextAttributeForm,
  UrlAttributeForm,
} from "components/custom-attributes";
// ui
import { PrimaryButton, ToggleSwitch } from "components/ui";
// icons
import { ChevronDown } from "lucide-react";
// types
import { ICustomAttribute, TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  data: Partial<ICustomAttribute>;
  handleDeleteAttribute: () => void;
  handleUpdateAttribute: (data: Partial<ICustomAttribute>) => Promise<void>;
  type: TCustomAttributeTypes;
};

export type FormComponentProps = {
  control: Control<Partial<ICustomAttribute>, any>;
  watch?: UseFormWatch<Partial<ICustomAttribute>>;
};

export const AttributeForm: React.FC<Props> = ({
  data,
  handleDeleteAttribute,
  handleUpdateAttribute,
  type,
}) => {
  const typeMetaData = CUSTOM_ATTRIBUTES_LIST[type];

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues: typeMetaData.defaultFormValues });

  const handleFormSubmit = async (data: Partial<ICustomAttribute>) => {
    await handleUpdateAttribute(data);
  };

  const renderForm = (type: TCustomAttributeTypes): JSX.Element => {
    let FormToRender = <></>;

    if (type === "checkbox") FormToRender = <CheckboxAttributeForm control={control} />;
    else if (type === "datetime") FormToRender = <DateTimeAttributeForm control={control} />;
    else if (type === "email") FormToRender = <EmailAttributeForm control={control} />;
    else if (type === "files") FormToRender = <FileAttributeForm control={control} />;
    else if (type === "multi_select")
      FormToRender = <SelectAttributeForm control={control} multiple />;
    else if (type === "number")
      FormToRender = <NumberAttributeForm control={control} watch={watch} />;
    else if (type === "relation") FormToRender = <RelationAttributeForm control={control} />;
    else if (type === "select") FormToRender = <SelectAttributeForm control={control} />;
    else if (type === "text") FormToRender = <TextAttributeForm control={control} />;
    else if (type === "url") FormToRender = <UrlAttributeForm control={control} />;

    return FormToRender;
  };

  useEffect(() => {
    if (!data) return;

    reset({
      ...typeMetaData.defaultFormValues,
      ...data,
    });
  }, [data, reset, typeMetaData.defaultFormValues]);

  return (
    <Disclosure
      as="div"
      className="bg-custom-background-90 border border-custom-border-200 rounded"
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="p-3 flex items-center justify-between gap-1 w-full">
            <div className="flex items-center gap-2.5">
              <typeMetaData.icon size={14} strokeWidth={1.5} />
              <h6 className="text-sm">{typeMetaData.label}</h6>
            </div>
            <div className={`${open ? "-rotate-180" : ""} transition-all`}>
              <ChevronDown size={16} strokeWidth={1.5} rotate="180deg" />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-3 pl-9 pt-0">
              {renderForm(type)}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Controller
                    control={control}
                    name="is_required"
                    render={({ field: { onChange, value } }) => (
                      <ToggleSwitch value={value ?? false} onChange={onChange} />
                    )}
                  />
                  <span className="text-xs">Mandatory field</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAttribute}
                    className="text-xs font-medium px-3 py-2 rounded bg-custom-background-100 border border-custom-border-200"
                  >
                    Remove
                  </button>
                  <PrimaryButton type="submit">{isSubmitting ? "Saving..." : "Save"}</PrimaryButton>
                </div>
              </div>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};