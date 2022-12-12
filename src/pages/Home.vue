<template>
  <q-page
    :class="userOnMobile ? 'items-start justify-start' : 'row items-start justify-start'"
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

    <div
      v-if="!userOnMobile"
      class="col-9 q-pr-xs"
    >
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

    <div
      v-if="!userOnMobile"
      class="col-3 q-pl-xs"
    >
      <q-card
        bordered
        flat
        square
      >
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Date Arrived</div>

          <q-input
            v-model="searchQuery.dateArrived"
            clearable
            dense
            outlined
            placeholder="YYYY-MM-DD"
            square
          >
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date
                v-model="searchQuery.dateArrived"
                first-day-of-week="1"
                flat
                mask="YYYY-MM-DD"
                minimal
                no-unset
              />
            </q-popup-proxy>
          </q-input>
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Invoice No.</div>

          <q-input
            v-model="searchQuery.invoiceNumber"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
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
          <div class="text-subtitle2">Part Description</div>

          <q-input
            v-model="searchQuery.partDescription"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Part No.</div>

          <q-input
            v-model="searchQuery.partNumber"
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
            unelevated
            @click="inventoryCreateDialog = true"
          >
            New Entry
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog
      v-model="inventoryCreateDialog"
      persistent
    >
      <q-card
        bordered
        flat
        square
        style="width: 600px;"
      >
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Date Arrived</div>

          <q-input
            v-model="inventoryCreate.dateArrived"
            dense
            outlined
            placeholder="YYYY-MM-DD HH:mm"
            square
          >
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date
                v-model="inventoryCreate.dateArrived"
                first-day-of-week="1"
                flat
                mask="YYYY-MM-DD HH:mm"
                minimal
                no-unset
              />
            </q-popup-proxy>
          </q-input>
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Invoice No.</div>

          <q-input
            v-model="inventoryCreate.invoiceNumber"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Location</div>

          <q-input
            v-model="inventoryCreate.location"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Part Description</div>

          <q-input
            v-model="inventoryCreate.partDescription"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Part No.</div>

          <q-input
            v-model="inventoryCreate.partNumber"
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

    <q-dialog
      v-model="inventoryEditDialog"
      persistent
    >
      <q-card
        bordered
        flat
        square
        style="width: 600px;"
      >
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Date Arrived</div>

          <q-input
            v-model="inventoryEdit.dateArrived"
            dense
            outlined
            placeholder="YYYY-MM-DD HH:mm"
            square
          >
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date
                v-model="inventoryEdit.dateArrived"
                first-day-of-week="1"
                flat
                mask="YYYY-MM-DD HH:mm"
                minimal
                no-unset
              />
            </q-popup-proxy>
          </q-input>
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Invoice No.</div>

          <q-input
            v-model="inventoryEdit.invoiceNumber"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Location</div>

          <q-input
            v-model="inventoryEdit.location"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Part Description</div>

          <q-input
            v-model="inventoryEdit.partDescription"
            dense
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Part No.</div>

          <q-input
            v-model="inventoryEdit.partNumber"
            dense
            outlined
            square
          />
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

    <q-dialog
      v-model="searchQueryDialog"
      persistent
    >
      <q-card
        bordered
        flat
        square
        style="width: 100%;"
      >
        <q-card-section class="q-pb-xs">
          <div class="text-subtitle2">Date Arrived</div>

          <q-input
            v-model="searchQuery.dateArrived"
            clearable
            dense
            outlined
            placeholder="YYYY-MM-DD"
            square
          >
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date
                v-model="searchQuery.dateArrived"
                first-day-of-week="1"
                flat
                mask="YYYY-MM-DD"
                minimal
                no-unset
              />
            </q-popup-proxy>
          </q-input>
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="text-subtitle2">Invoice No.</div>

          <q-input
            v-model="searchQuery.invoiceNumber"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-py-xs">
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
          <div class="text-subtitle2">Part Description</div>

          <q-input
            v-model="searchQuery.partDescription"
            clearable
            dense
            :disable="inventoryAllGetLoading"
            outlined
            square
          />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-subtitle2">Part No.</div>

          <q-input
            v-model="searchQuery.partNumber"
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
            color="blue"
            :ripple="false"
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
import { QTableProps, useQuasar } from 'quasar'
import { computed, defineComponent, onMounted, ref } from 'vue'

import useAuthUser from 'src/composables/useAuthUser'
import useSupabase from 'src/composables/useSupabase'
import { prettifyDate } from 'src/utils'

type Inventory = {
  dateArrived: string
  id: string
  invoiceNumber: string
  lastModified: string
  location: string
  partDescription: string
  partNumber: string
}

const columns: QTableProps['columns'] = [
  {
    align: 'left',
    field: 'dateArrived',
    headerStyle: 'width: 150px',
    label: 'Date Arrived',
    name: 'dateArrived',
    sortable: false,
    style: 'width: 150px'
  },
  {
    align: 'left',
    field: 'location',
    headerStyle: 'width: 150px',
    label: 'Location',
    name: 'location',
    sortable: true,
    style: 'max-width: 150px; overflow: hidden; text-overflow: ellipsis; width: 150px'
  },
  {
    align: 'right',
    field: 'partDescription',
    headerStyle: 'max-width: 150px',
    label: 'Part Desc.',
    name: 'partDescription',
    sortable: true,
    style: 'max-width: 150px; overflow: hidden; text-overflow: ellipsis;'
  },
  {
    align: 'right',
    field: 'partNumber',
    headerStyle: 'width: 150px',
    label: 'Part No.',
    name: 'partNumber',
    sortable: true,
    style: 'max-width: 150px; overflow: hidden; text-overflow: ellipsis; width: 150px'
  },
  {
    align: 'right',
    field: 'invoiceNumber',
    headerStyle: 'width: 150px',
    label: 'Invoice No.',
    name: 'invoiceNumber',
    sortable: true,
    style: 'max-width: 150px; overflow: hidden; text-overflow: ellipsis; width: 150px'
  },
  {
    align: 'right',
    field: 'actions',
    headerStyle: 'width: 100px',
    label: 'Actions',
    name: 'actions',
    sortable: false,
    style: 'width: 100px'
  }
]

export default defineComponent({
  name: 'AppHome',

  setup () {
    const $quasar = useQuasar()

    const { userName } = useAuthUser()
    const { supabase } = useSupabase()

    // Inventory All
    const inventoryAll = ref<Inventory[]>([])
    const inventoryAllGet = async () => {
      inventoryAllGetLoading.value = true
      inventoryAll.value = []

      const { data, error } = await supabase.from('inventory').select('*')

      inventoryAllGetLoading.value = false

      if (!data || error) {
        if (!data) console.log('unspecified error')
        if (error) console.log(error)

        return
      }

      inventoryAll.value = data.map(m => {
        return {
          dateArrived: prettifyDate(new Date(m.date_arrived)),
          id: m.id,
          invoiceNumber: m.invoice_number,
          lastModified: m.last_modified,
          location: m.location,
          partDescription: m.part_description,
          partNumber: m.part_number
        }
      })
    }
    const inventoryAllGetLoading = ref(false)
    onMounted(inventoryAllGet)

    // Inventory Create
    const inventoryCreate = ref<Inventory>({ dateArrived: prettifyDate(new Date()), id: '', invoiceNumber: '', lastModified: `${prettifyDate(new Date())} - ${userName.value}`, location: '', partDescription: '', partNumber: '' })
    const inventoryCreateCancel = () => {
      inventoryCreate.value = { dateArrived: prettifyDate(new Date()), id: '', invoiceNumber: '', lastModified: `${prettifyDate(new Date())} - ${userName.value}`, location: '', partDescription: '', partNumber: '' }
      inventoryCreateDialog.value = false
      inventoryCreateSaveLoading.value = false
    }
    const inventoryCreateDialog = ref(false)
    const inventoryCreateSave = async () => {
      if (!inventoryCreateValid.value) return

      inventoryCreateSaveLoading.value = true

      const { data, error } = await supabase.from('inventory').insert({
        date_arrived: new Date(inventoryCreate.value.dateArrived).toISOString(),
        invoice_number: inventoryCreate.value.invoiceNumber,
        last_modified: inventoryCreate.value.lastModified,
        location: inventoryCreate.value.location,
        part_description: inventoryCreate.value.partDescription,
        part_number: inventoryCreate.value.partNumber
      }).select().single()

      inventoryCreateSaveLoading.value = false

      if (!data || error) {
        if (!data) console.log('unspecified error')
        if (error) console.log(error)

        return
      }

      inventoryAll.value.push({
        dateArrived: prettifyDate(new Date(data.date_arrived)),
        id: data.id,
        invoiceNumber: data.invoice_number,
        lastModified: data.last_modified,
        location: data.location,
        partDescription: data.part_description,
        partNumber: data.part_number
      })

      inventoryCreateCancel()
    }
    const inventoryCreateSaveLoading = ref(false)
    const inventoryCreateValid = computed(() => {
      let valid = true

      if (!inventoryCreate.value.dateArrived) valid = false
      if (!inventoryCreate.value.invoiceNumber) valid = false
      if (!inventoryCreate.value.location) valid = false
      if (!inventoryCreate.value.partDescription && !inventoryCreate.value.partNumber) valid = false

      return valid
    })

    // Inventory Edit
    const inventoryEdit = ref<Inventory>({ dateArrived: '', id: '', invoiceNumber: '', lastModified: '', location: '', partDescription: '', partNumber: '' })
    const inventoryEditCancel = () => {
      inventoryEdit.value = { dateArrived: '', id: '', invoiceNumber: '', lastModified: '', location: '', partDescription: '', partNumber: '' }
      inventoryEditDialog.value = false
      inventoryEditSaveLoading.value = false
    }
    const inventoryEditDialog = ref(false)
    const inventoryEditOpen = (inventory: Inventory) => {
      const inventoryJSON = JSON.stringify(inventory)
      inventoryEdit.value = JSON.parse(inventoryJSON) as Inventory
      inventoryEditDialog.value = true
    }
    const inventoryEditSave = async () => {
      if (!inventoryEditValid.value) return

      inventoryEditSaveLoading.value = true

      let { data, error } = await supabase.from('inventory').update({
        date_arrived: new Date(inventoryEdit.value.dateArrived).toISOString(),
        invoice_number: inventoryEdit.value.invoiceNumber,
        last_modified: `${prettifyDate(new Date())} - ${userName.value}`,
        location: inventoryEdit.value.location,
        part_description: inventoryEdit.value.partDescription,
        part_number: inventoryEdit.value.partNumber
      }).eq('id', inventoryEdit.value.id).select().single()

      inventoryEditSaveLoading.value = false

      if (!data || error) {
        if (!data) console.log('unspecified error')
        if (error) console.log(error)

        return
      }

      const inventoryIndex = inventoryAll.value.findIndex(m => m.id === inventoryEdit.value.id)
      if (inventoryIndex >= 0) {
        inventoryAll.value.splice(inventoryIndex, 1, {
          dateArrived: prettifyDate(new Date(data.date_arrived)),
          id: data.id,
          invoiceNumber: data.invoice_number,
          lastModified: data.last_modified,
          location: data.location,
          partDescription: data.part_description,
          partNumber: data.part_number
        })
      } else {
        inventoryAll.value.push({
          dateArrived: prettifyDate(new Date(data.date_arrived)),
          id: data.id,
          invoiceNumber: data.invoice_number,
          lastModified: data.last_modified,
          location: data.location,
          partDescription: data.part_description,
          partNumber: data.part_number
        })
      }

      inventoryEditCancel()
    }
    const inventoryEditSaveLoading = ref(false)
    const inventoryEditValid = computed(() => {
      let valid = true

      if (!inventoryEdit.value.dateArrived) valid = false
      if (!inventoryEdit.value.invoiceNumber) valid = false
      if (!inventoryEdit.value.location) valid = false
      if (!inventoryEdit.value.partDescription && !inventoryEdit.value.partNumber) valid = false

      return valid
    })

    // Inventory Remove
    const inventoryRemove = (inventoryID: string) => {
      $quasar.dialog({ cancel: true, focus: 'none', message: 'Are you sure?', persistent: true }).onOk(async () => {
        inventoryRemoveLoading.value = inventoryID

        const { error } = await supabase.from('inventory').delete().eq('id', inventoryID)

        inventoryRemoveLoading.value = ''

        inventoryAll.value = inventoryAll.value.filter(m => m.id !== inventoryID)

        if (error) {
          if (error) console.log(error)

          return
        }
      })
    }
    const inventoryRemoveLoading = ref('')

    // Search Query
    const searchQuery = ref<Inventory>({ dateArrived: '', id: '', invoiceNumber: '', lastModified: '', location: '', partDescription: '', partNumber: '' })
    const searchQueryDialog = ref(false)
    const searchQueryLocationOpts = computed(() => {
      return inventoryAll.value
        .map(m => m.location)
        .filter((m, n, a) => a.indexOf(m) === n)
        .sort((a, b) => a.localeCompare(b))
    })
    const searchQueryResultsFiltered = computed(() => {
      return inventoryAll.value
        .filter(m => searchQuery.value.dateArrived ? m.dateArrived.indexOf(searchQuery.value.dateArrived) >= 0 : true)
        .filter(m => searchQuery.value.invoiceNumber ? m.invoiceNumber.toLowerCase().indexOf(searchQuery.value.invoiceNumber.toLowerCase()) >= 0 : true)
        .filter(m => searchQuery.value.location ? m.location.toLowerCase().indexOf(searchQuery.value.location.toLowerCase()) >= 0 : true)
        .filter(m => searchQuery.value.partDescription ? m.partDescription.toLowerCase().indexOf(searchQuery.value.partDescription.toLowerCase()) >= 0 : true)
        .filter(m => searchQuery.value.partNumber ? m.partNumber.toLowerCase().indexOf(searchQuery.value.partNumber.toLowerCase()) >= 0 : true)
        .sort((a, b) => {
          const aDate = new Date(a.dateArrived)
          const bDate = new Date(b.dateArrived)

          return bDate.getTime() - aDate.getTime()
        })
    })

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
      userOnMobile: computed(() => $quasar.screen.lt.sm)
    }
  }
})
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
