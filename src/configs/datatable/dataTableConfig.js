import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import languageES from "datatables.net-plugins/i18n/es-ES.mjs";
import "datatables.net-responsive";

DataTable.use(DataTablesCore);

export { DataTable };

export const dtOptions = {
  language: languageES,
  lengthChange: false,
  ordering: false,
  responsive: true,
};

export const GenerateEditViewBtn = (itemId, isEdit = true) =>
  `<button
  data-edit-view-id="${itemId}"
  type="button" title="${isEdit ? "Editar" : "Ver"}"
  class="btn-edit-view v-btn v-btn--icon v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-text">
    <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
    <span class="v-btn__content" data-no-activator="">
      <i class="${
        isEdit ? "mdi-pencil" : "mdi-eye"
      } mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>
    </span>
</button>`;

export const AttachEditViewEvent = (dtInstance, handleClick) => {
  dtInstance.on("click", ".btn-edit-view", (event) => {
    const itemId = event.currentTarget.getAttribute("data-edit-view-id");
    handleClick(itemId);
  });
};

export const GenerateDeleteBtn = (itemId) =>
  `<button
  data-delete-id="${itemId}"
  type="button" title="Eliminar"
  class="btn-delete v-btn v-btn--icon v-theme--light text-red v-btn--density-default v-btn--size-default v-btn--variant-text">
    <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
    <span class="v-btn__content" data-no-activator="">
      <i class="mdi-delete mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>
    </span>
</button>`;

export const AttachDeleteEvent = (dtInstance, handleClick) => {
  dtInstance.on("click", ".btn-delete", (event) => {
    const itemId = event.currentTarget.getAttribute("data-delete-id");
    handleClick(itemId);
  });
};

export const GenerateChip = (text, color) =>
  `<span class="v-chip v-theme--light ${color} v-chip--density-default v-chip--size-default v-chip--variant-tonal ma-2" draggable="false">
<span class="v-chip__underlay"></span><div class="v-chip__content"> ${text} </div></span>`;
