<template>
  <q-page
    :class="
      userOnMobile
        ? 'items-start justify-start'
        : 'row items-start justify-start'
    "
    padding
  >
    <div v-if="userOnMobile">
      <q-table
        bordered
        :columns="columns"
        flat
        :loading="inventoryAllGetLoading"
        :rows="searchQueryResults"
        :rows-per-page-options="[10]"
        square
      >
        <template v-slot:top>
          <div class="q-table__title">Warehouse Inventory</div>

          <q-space />

          <q-btn
            class="q-mr-xs"
            color="blue"
            dense
            flat
            icon="search"
            :ripple="false"
            @click="searchQueryDialog = true"
          >
            <q-tooltip>Search Query</q-tooltip>
          </q-btn>

          <q-btn
            color="green"
            dense
            flat
            icon="add"
            :ripple="false"
            @click="inventoryCreateDialog = true"
          >
            <q-tooltip>New Entry</q-tooltip>
          </q-btn>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td class="text-right">
            <q-btn
              color="green"
              dense
              flat
              icon="check"
              :ripple="false"
              size="sm"
              @click="inventoryEditOpen(props.row)"
            >
              <q-tooltip>Edit Entry</q-tooltip>
            </q-btn>

            <q-btn
              color="red"
              dense
              flat
              icon="remove"
              :loading="inventoryRemoveLoading === props.row.id"
              :ripple="false"
              size="sm"
              @click="inventoryRemove(props.row.id)"
            >
              <q-tooltip>Delete Entry</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <div v-if="!userOnMobile" class="col-9 q-pr-xs">
      <q-table
        bordered
        :columns="columns"
        flat
        :loading="inventoryAllGetLoading"
        :rows="searchQueryResults"
        :rows-per-page-options="[10]"
        square
        title="Warehouse Inventory"
      >
        <template v-slot:body-cell-actions="props">
          <q-td class="text-right">
            <q-btn
              color="green"
              dense
              flat
              icon="check"
              :ripple="false"
              size="sm"
              @click="inventoryEditOpen(props.row)"
            >
              <q-tooltip>Edit Entry</q-tooltip>
            </q-btn>

            <q-btn
              color="red"
              dense
              flat
              icon="remove"
              :loading="inventoryRemoveLoading === props.row.id"
              :ripple="false"
              size="sm"
              @click="inventoryRemove(props.row.id)"
            >
              <q-tooltip>Delete Entry</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <div v-if="!userOnMobile" class="col-3 q-pl-xs">
      <q-card bordered flat square>
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Location</div>

          <q-select
            v-model="searchQuery.location"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            :options="searchQueryLocationOpts"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier</div>

          <q-input
            v-model="searchQuery.supplier"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier Code</div>

          <q-input
            v-model="searchQuery.supplierCode"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Tidings Code</div>

          <q-input
            v-model="searchQuery.tidingsCode"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            class="full-width"
            color="green"
            :ripple="false"
            style="border-radius: 0px"
            unelevated
            @click="inventoryCreateDialog = true"
          >
            New Entry
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="inventoryCreateDialog" persistent>
      <q-card bordered flat square style="width: 600px">
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Location</div>

          <q-input v-model="inventoryCreate.location" dense outlined square />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Quantity</div>

          <q-input
            v-model.number="inventoryCreate.quantity"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier</div>

          <q-input v-model="inventoryCreate.supplier" dense outlined square />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier Code</div>

          <q-input
            v-model="inventoryCreate.supplierCode"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Tidings Code</div>

          <q-input
            v-model="inventoryCreate.tidingsCode"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            :class="userOnMobile ? 'mobile-btn' : 'desktop-btn' + ' q-mx-sm'"
            color="red"
            :disable="inventoryCreateSaveLoading"
            :ripple="false"
            unelevated
            @click="inventoryCreateCancel"
          >
            Cancel
          </q-btn>

          <q-space />

          <q-btn
            :class="userOnMobile ? 'mobile-btn' : 'desktop-btn' + ' q-mx-sm'"
            color="green"
            :disable="!inventoryCreateValid"
            :loading="inventoryCreateSaveLoading"
            :ripple="false"
            unelevated
            @click="inventoryCreateSave"
          >
            Save
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="inventoryEditDialog" persistent>
      <q-card bordered flat square style="width: 600px">
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Location</div>

          <q-input v-model="inventoryEdit.location" dense outlined square />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Quantity</div>

          <q-input
            v-model.number="inventoryEdit.quantity"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier</div>

          <q-input v-model="inventoryEdit.supplier" dense outlined square />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier Code</div>

          <q-input v-model="inventoryEdit.supplierCode" dense outlined square />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Tidings Code</div>

          <q-input v-model="inventoryEdit.tidingsCode" dense outlined square />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Last Modified</div>

          <q-input
            v-model="inventoryEdit.lastModified"
            dense
            disable
            outlined
            square
          />
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            :class="userOnMobile ? 'mobile-btn' : 'desktop-btn' + ' q-mx-sm'"
            color="red"
            :disable="inventoryEditSaveLoading"
            :ripple="false"
            unelevated
            @click="inventoryEditCancel"
          >
            Cancel
          </q-btn>

          <q-space />

          <q-btn
            :class="userOnMobile ? 'mobile-btn' : 'desktop-btn' + ' q-mx-sm'"
            color="green"
            :disable="!inventoryEditValid"
            :loading="inventoryEditSaveLoading"
            :ripple="false"
            unelevated
            @click="inventoryEditSave"
          >
            Save
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="searchQueryDialog" persistent>
      <q-card bordered flat square style="width: 100%">
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Location</div>

          <q-select
            v-model="searchQuery.location"
            clearable
            dense
            :options="searchQueryLocationOpts"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier</div>

          <q-input
            v-model="searchQuery.supplier"
            clearable
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Supplier Code</div>

          <q-input
            v-model="searchQuery.supplierCode"
            clearable
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Tidings Code</div>

          <q-input
            v-model="searchQuery.tidingsCode"
            clearable
            dense
            outlined
            square
          />
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            class="full-width"
            color="blue"
            :ripple="false"
            style="border-radius: 0px"
            unelevated
            @click="searchQueryDialog = false"
          >
            Save
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { computed, defineComponent, onMounted, ref } from 'vue';

import useAuthUser from 'src/composables/useAuthUser';
import useSupabase from 'src/composables/useSupabase';
import { prettifyDate } from 'src/utils';

type Inventory = {
  id: string;
  lastModified: string;
  location: string;
  quantity: number;
  supplier: string;
  supplierCode: string;
  tidingsCode: string;
};

const columns: QTableProps['columns'] = [
  {
    align: 'left',
    field: 'supplierCode',
    headerStyle: 'width: 150px',
    label: 'Supplier Code',
    name: 'supplierCode',
    sortable: false,
    style:
      'max-width: 150px; overflow: hidden; text-overflow: ellipsis; width: 150px',
  },
  {
    align: 'left',
    field: 'tidingsCode',
    headerStyle: 'width: 150px',
    label: 'Tidings Code',
    name: 'tidingsCode',
    sortable: true,
    style:
      'max-width: 150px; overflow: hidden; text-overflow: ellipsis; width: 150px',
  },
  {
    align: 'left',
    field: 'supplier',
    headerStyle: 'width: 200px',
    label: 'Supplier',
    name: 'supplier',
    sortable: true,
    style:
      'max-width: 200px; overflow: hidden; text-overflow: ellipsis; width: 200px',
  },
  {
    align: 'right',
    field: 'location',
    label: 'Location',
    name: 'location',
    sortable: true,
  },
  {
    align: 'right',
    field: 'quantity',
    headerStyle: 'width: 100px',
    label: 'Quantity',
    name: 'quantity',
    sortable: false,
    style: 'width: 100px',
  },
  {
    align: 'right',
    field: 'actions',
    headerStyle: 'width: 100px',
    label: 'Actions',
    name: 'actions',
    sortable: false,
    style: 'width: 100px',
  },
];

export default defineComponent({
  name: 'AppHome',

  setup() {
    const $quasar = useQuasar();

    const { userName } = useAuthUser();
    const { supabase } = useSupabase();

    // setup realtime database
    supabase
      .channel('public:inventory')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            inventoryAll.value = inventoryAll.value.filter(
              (m) => m.id !== payload.old['id']
            );
          }

          if (payload.eventType === 'INSERT') {
            inventoryAll.value.push({
              id: payload.new['id'],
              lastModified: payload.new['last_modified'],
              location: payload.new['location'],
              quantity: payload.new['quantity'],
              supplier: payload.new['supplier'],
              supplierCode: payload.new['supplier_code'],
              tidingsCode: payload.new['tidings_code'],
            });
          }

          if (payload.eventType === 'UPDATE') {
            const inventoryIndex = inventoryAll.value.findIndex(
              (m) => m.id === payload.old['id']
            );
            if (inventoryIndex >= 0) {
              inventoryAll.value.splice(inventoryIndex, 1, {
                id: payload.new['id'],
                lastModified: payload.new['last_modified'],
                location: payload.new['location'],
                quantity: payload.new['quantity'],
                supplier: payload.new['supplier'],
                supplierCode: payload.new['supplier_code'],
                tidingsCode: payload.new['tidings_code'],
              });
            }
          }
        }
      )
      .subscribe();

    // Inventory All
    const inventoryAll = ref<Inventory[]>([]);
    const inventoryAllGet = async () => {
      inventoryAllGetLoading.value = true;
      inventoryAll.value = [];

      const { data, error } = await supabase.from('inventory').select('*');

      inventoryAllGetLoading.value = false;

      if (!data || error) {
        if (!data) console.log('unspecified error');
        if (error) console.log(error);

        return;
      }

      inventoryAll.value = data.map((m) => {
        return {
          id: m.id,
          lastModified: m.last_modified,
          location: m.location,
          quantity: m.quantity,
          supplier: m.supplier,
          supplierCode: m.supplier_code,
          tidingsCode: m.tidings_code,
        };
      });
    };
    const inventoryAllGetLoading = ref(false);
    onMounted(inventoryAllGet);

    // Inventory Create
    const inventoryCreate = ref<Inventory>({
      id: '',
      lastModified: '',
      location: '',
      quantity: 0,
      supplier: '',
      supplierCode: '',
      tidingsCode: '',
    });
    const inventoryCreateCancel = () => {
      inventoryCreate.value = {
        id: '',
        lastModified: '',
        location: '',
        quantity: 0,
        supplier: '',
        supplierCode: '',
        tidingsCode: '',
      };
      inventoryCreateDialog.value = false;
      inventoryCreateSaveLoading.value = false;
    };
    const inventoryCreateDialog = ref(false);
    const inventoryCreateSave = async () => {
      if (!inventoryCreateValid.value) return;

      inventoryCreateSaveLoading.value = true;

      const { data, error } = await supabase
        .from('inventory')
        .insert({
          last_modified: `${prettifyDate(new Date())} - ${userName.value}`,
          location: inventoryCreate.value.location,
          quantity: inventoryCreate.value.quantity,
          supplier: inventoryCreate.value.supplier,
          supplier_code: inventoryCreate.value.supplierCode,
          tidings_code: inventoryCreate.value.tidingsCode,
        })
        .select()
        .single();

      if (!data || error) {
        if (!data) console.log('unspecified error');
        if (error) console.log(error);

        return;
      }

      inventoryCreateCancel();
    };
    const inventoryCreateSaveLoading = ref(false);
    const inventoryCreateValid = computed(() => {
      let valid = true;

      if (!inventoryCreate.value.location) valid = false;
      if (inventoryCreate.value.quantity < 0) valid = false;
      if (!inventoryCreate.value.supplier) valid = false;
      if (
        !inventoryCreate.value.supplierCode &&
        !inventoryCreate.value.tidingsCode
      )
        valid = false;

      return valid;
    });

    // Inventory Edit
    const inventoryEdit = ref<Inventory>({
      id: '',
      lastModified: '',
      location: '',
      quantity: 0,
      supplier: '',
      supplierCode: '',
      tidingsCode: '',
    });
    const inventoryEditCancel = () => {
      inventoryEdit.value = {
        id: '',
        lastModified: '',
        location: '',
        quantity: 0,
        supplier: '',
        supplierCode: '',
        tidingsCode: '',
      };
      inventoryEditDialog.value = false;
      inventoryEditSaveLoading.value = false;
    };
    const inventoryEditDialog = ref(false);
    const inventoryEditOpen = (inventory: Inventory) => {
      const inventoryJSON = JSON.stringify(inventory);
      inventoryEdit.value = JSON.parse(inventoryJSON) as Inventory;
      inventoryEditDialog.value = true;
    };
    const inventoryEditSave = async () => {
      if (!inventoryEditValid.value) return;

      inventoryEditSaveLoading.value = true;

      let { data, error } = await supabase
        .from('inventory')
        .update({
          last_modified: `${prettifyDate(new Date())} - ${userName.value}`,
          location: inventoryEdit.value.location,
          quantity: inventoryEdit.value.quantity,
          supplier: inventoryEdit.value.supplier,
          supplier_code: inventoryEdit.value.supplierCode,
          tidings_code: inventoryEdit.value.tidingsCode,
        })
        .eq('id', inventoryEdit.value.id)
        .select()
        .single();

      if (!data || error) {
        if (!data) console.log('unspecified error');
        if (error) console.log(error);

        return;
      }

      inventoryEditCancel();
    };
    const inventoryEditSaveLoading = ref(false);
    const inventoryEditValid = computed(() => {
      let valid = true;

      if (!inventoryEdit.value.location) valid = false;
      if (inventoryEdit.value.quantity < 0) valid = false;
      if (!inventoryEdit.value.supplier) valid = false;
      if (!inventoryEdit.value.supplierCode && !inventoryEdit.value.tidingsCode)
        valid = false;

      return valid;
    });

    // Inventory Remove
    const inventoryRemove = (inventoryID: string) => {
      $quasar
        .dialog({
          cancel: true,
          focus: 'none',
          message: 'Are you sure?',
          persistent: true,
        })
        .onOk(async () => {
          inventoryRemoveLoading.value = inventoryID;

          const { error } = await supabase
            .from('inventory')
            .delete()
            .eq('id', inventoryID);

          if (error) {
            if (error) console.log(error);

            return;
          }

          inventoryRemoveLoading.value = '';
        });
    };
    const inventoryRemoveLoading = ref('');

    // Search Query
    const searchQuery = ref<Inventory>({
      id: '',
      lastModified: '',
      location: '',
      quantity: 0,
      supplier: '',
      supplierCode: '',
      tidingsCode: '',
    });
    const searchQueryDialog = ref(false);
    const searchQueryLocationOpts = computed(() => {
      return inventoryAll.value
        .map((m) => m.location)
        .filter((m, n, a) => a.indexOf(m) === n)
        .sort((a, b) => a.localeCompare(b));
    });
    const searchQueryResultsFiltered = computed(() => {
      return inventoryAll.value
        .filter((m) =>
          searchQuery.value.location
            ? m.location
                .toLowerCase()
                .indexOf(searchQuery.value.location.toLowerCase()) >= 0
            : true
        )
        .filter((m) =>
          searchQuery.value.supplier
            ? m.supplier
                .toLowerCase()
                .indexOf(searchQuery.value.supplier.toLowerCase()) >= 0
            : true
        )
        .filter((m) =>
          searchQuery.value.supplierCode
            ? m.supplierCode
                .toLowerCase()
                .indexOf(searchQuery.value.supplierCode.toLowerCase()) >= 0
            : true
        )
        .filter((m) =>
          searchQuery.value.tidingsCode
            ? m.tidingsCode
                .toLowerCase()
                .indexOf(searchQuery.value.tidingsCode.toLowerCase()) >= 0
            : true
        );
    });

    return {
      columns,
      inventoryAllGetLoading,
      inventoryCreate,
      inventoryCreateCancel,
      inventoryCreateDialog,
      inventoryCreateSave,
      inventoryCreateSaveLoading,
      inventoryCreateValid,
      inventoryEdit,
      inventoryEditCancel,
      inventoryEditDialog,
      inventoryEditOpen,
      inventoryEditSave,
      inventoryEditSaveLoading,
      inventoryEditValid,
      inventoryRemove,
      inventoryRemoveLoading,
      searchQuery,
      searchQueryDialog,
      searchQueryLocationOpts,
      searchQueryResults: searchQueryResultsFiltered,
      userOnMobile: computed(() => $quasar.screen.lt.sm),
    };
  },
});
</script>

<style scoped>
.desktop-btn {
  border-radius: 0;
  max-width: 150px;
  width: 100%;
}

.mobile-btn {
  border-radius: 0;
  max-width: 125px;
  width: 100%;
}
</style>
