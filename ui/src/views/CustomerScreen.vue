<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, ${name}`" />

    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" />

    <h2>Draft Order</h2>
    <strong>Available ingredients: </strong>
    <div v-if="possibleIngredients" class="mb-2">
      {{ possibleIngredients.map((ing) => ing.name).join(", ") }}
    </div>

    Select the ingredients you want: <strong>Total Cost: {{ totalCost }}</strong> <br />
    <b-button pill variant="primary" v-for="ingredient in possibleIngredients" :key="ingredient._id"
      @click="addIngredient(ingredient)" size="sm" class="ml-1">Add {{
          ingredient.name
      }}</b-button>

    <b-list-group class="my-2">
      <b-list-group-item v-for="(ingredient, index) in draftOrderIngredients" :key="index">
        {{ ingredient.name }} <strong>{{ ingredient.price }} <b-button pill variant="outline-danger" size="sm"
            @click="removeIngredient(index)">Remove</b-button></strong> </b-list-group-item>
    </b-list-group>

    <div class="mt-2">
      <b-button @click="save" id="save-btn">Save</b-button>
    </div>
    <div class="mt-2">
      <b-button @click="submit" id="submit-btn">Submit</b-button>
      Note: must save before submitting
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { CustomerWithOrders, Ingredient } from "../../../server/data"

// props
interface Props {
  customerId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  customerId: "",
})

const customer: Ref<CustomerWithOrders | null> = ref(null)

const name = computed(() => customer.value?.name || props.customerId)
const draftOrderIngredients: Ref<string[]> = ref([])
const possibleIngredients: Ref<string[]> = ref([])
const totalCost = computed(() => draftOrderIngredients.value.reduce((accum: any, item: any) => accum + item.price, 0));

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()

  if (props.customerId) {
    customer.value = await (await fetch("/api/customer/" + encodeURIComponent(props.customerId))).json()
    draftOrderIngredients.value = (await (await fetch("/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order")).json())?.ingredients || []
  }
}
onMounted(refresh)

async function save() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ingredients: draftOrderIngredients.value })
    }
  )
}

async function submit() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/submit-draft-order",
    { method: "POST" }
  )
  await refresh()
}

function addIngredient(ingredient: any) {
  draftOrderIngredients.value = [...draftOrderIngredients.value, ingredient];
}

function removeIngredient(index: number) {
  draftOrderIngredients.value.splice(index, 1)
}
</script>