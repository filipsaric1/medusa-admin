import clsx from "clsx"
import { Link } from "gatsby"
import React, { useEffect, useRef, useState } from "react"

import { SalesChannel } from "@medusajs/medusa"
import {
  useAdminDeleteSalesChannel,
  useAdminSalesChannels,
  useAdminStore,
  useAdminUpdateSalesChannel,
} from "medusa-react"

import EditSalesChannel from "../form/edit-sales-channel"
import AddSalesChannelModal from "../form/add-sales-channel"
import Actionables from "../../../components/molecules/actionables"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import ArrowLeftIcon from "../../../components/fundamentals/icons/arrow-left-icon"
import {
  SalesChannelProductsSelectModal,
  SalesChannelProductsTable,
} from "../tables/product"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import StatusSelector from "../../../components/molecules/status-selector"

type ListIndicatorProps = { isActive: boolean }

/**
 * Sales channels list indicator component.
 */
function ListIndicator(props: ListIndicatorProps) {
  const { isActive } = props
  return (
    <div
      className={clsx(
        "flex justify-center items-center w-[18px] h-[18px] bg-white border rounded-circle",
        {
          "border-2 border-violet-60": isActive,
        }
      )}
    >
      {isActive && (
        <div className="w-[10px] h-[10px] bg-violet-60 rounded-circle" />
      )}
    </div>
  )
}

type SalesChannelTileProps = {
  salesChannel: SalesChannel
  isSelected: boolean
  onClick: () => void
}

/**
 * Sales channels list tile component.
 */
function SalesChannelTile(props: SalesChannelTileProps) {
  const { salesChannel, isSelected, onClick } = props

  return (
    <div
      onClick={onClick}
      className={clsx("mb-2 p-4 cursor-pointer rounded-lg border flex gap-2", {
        "border-2 border-violet-60": isSelected,
      })}
    >
      <ListIndicator isActive={isSelected} />
      <div>
        <h3 className="font-semibold text-grey-90 leading-5 mb-1">
          {salesChannel.name}
        </h3>
        <span className="text-small text-grey-50">
          {salesChannel.description}
        </span>
      </div>
    </div>
  )
}

type SalesChannelsHeaderProps = {
  openCreateModal: () => void
  filterText?: string
  setFilterText: (text: string) => void
}

/**
 * Sales channel header.
 */
function SalesChannelsHeader(props: SalesChannelsHeaderProps) {
  const { openCreateModal, filterText, setFilterText } = props
  const [showFilter, setShowFilter] = useState(false)

  const inputRef = useRef()

  const classes = {
    "translate-y-[-50px]": showFilter,
    "translate-y-[0px]": !showFilter,
  }

  const hideFilter = () => {
    setShowFilter(false)
    setFilterText("")
  }

  useEffect(() => {
    if (showFilter) {
      // inputRef.current.focus()
    }
  }, [showFilter])

  return (
    <div className="h-[55px] mb-6 overflow-hidden">
      <div className={clsx(" transition-all duration-200", classes)}>
        <div className="h-[55px]">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-semibold text-xlarge text-grey-90">
              Sales Channels
            </h2>
            <div className="flex justify-between items-center gap-4">
              <SearchIcon
                size={15}
                onClick={() => setShowFilter(true)}
                className="cursor-pointer"
              />
              <PlusIcon
                size={15}
                onClick={openCreateModal}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="text-grey-50 text-small mb-6">
            Control which products are available in which channels
          </div>
        </div>

        <div className="h-[40px] my-[5px] w-full flex items-center justify-around gap-2 text-grey-40 bg-grey-5 px-4 rounded-xl border">
          <SearchIcon size={20} />
          <input
            ref={inputRef}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search by title or description"
            className="bg-inherit outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40"
            autoComplete="off"
          />
          <CrossIcon onClick={hideFilter} className="cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

type SalesChannelsListProps = {
  activeChannelId: string
  openCreateModal: () => void
  filterText?: string
  setFilterText: (text: string) => void
  salesChannels: SalesChannel[]
  setActiveSalesChannel: (sc: SalesChannel) => void
}

/**
 * Sales channels list.
 */
function SalesChannelsList(props: SalesChannelsListProps) {
  const {
    activeChannelId,
    openCreateModal,
    setActiveSalesChannel,
    salesChannels,
    filterText,
    setFilterText,
  } = props

  return (
    <div className="col-span-1 rounded-lg border bg-grey-0 border-grey-20 px-8 py-6">
      <SalesChannelsHeader
        filterText={filterText}
        setFilterText={setFilterText}
        openCreateModal={openCreateModal}
      />
      <div>
        {salesChannels?.map((s) => (
          <SalesChannelTile
            salesChannel={s}
            isSelected={activeChannelId === s.id}
            onClick={() => setActiveSalesChannel(s)}
          />
        ))}
      </div>
    </div>
  )
}

type SalesChannelDetailsHeaderProps = {
  salesChannel: SalesChannel
  openUpdateModal: () => void
  resetDetails: () => void
  setShowAddProducts: (show: boolean) => void
}

/**
 * Sales channels details header.
 */
function SalesChannelDetailsHeader(props: SalesChannelDetailsHeaderProps) {
  const {
    salesChannel,
    openUpdateModal,
    resetDetails,
    setShowAddProducts,
  } = props

  const { mutate: deleteSalesChannel } = useAdminDeleteSalesChannel(
    salesChannel.id
  )

  const { mutate: updateSalesChannel } = useAdminUpdateSalesChannel(
    salesChannel.id
  )

  const [showDelete, setShowDelete] = useState(false)

  const actions = [
    {
      label: "Edit general info",
      icon: <EditIcon size="20" />,
      onClick: openUpdateModal,
    },
    {
      label: "Add/Edit products",
      icon: <PlusIcon />,
      onClick: () => setShowAddProducts(true),
    },
    {
      label: "Delete sales channel",
      icon: <TrashIcon size={20} />,
      variant: "danger",
      onClick: () => setShowDelete(true),
    },
  ]

  return (
    <div className="flex justify-between items-center">
      <h2 className="font-semibold text-xlarge text-grey-90 mb-4">
        {salesChannel.name}
      </h2>
      <div className="flex justify-between items-center gap-4">
        <StatusSelector
          onChange={() =>
            updateSalesChannel({ is_disabled: !salesChannel.is_disabled })
          }
          isDraft={salesChannel.is_disabled}
          draftState="Disabled"
          activeState="Enabled"
        />
        <Actionables forceDropdown={true} actions={actions} />
      </div>

      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(false)}
          onDelete={async () => {
            deleteSalesChannel()
            resetDetails()
          }}
          confirmText="Yes, delete"
          successText="Sales channel deleted"
          text={`Are you sure you want to delete "${salesChannel.name}" sales channel?`}
          heading="Delete sales channel"
        />
      )}
    </div>
  )
}

type SalesChannelDetailsProps = {
  salesChannel: SalesChannel
  resetDetails: () => void
}

/**
 * Sales channels details container.
 */
function SalesChannelDetails(props: SalesChannelDetailsProps) {
  const { resetDetails, salesChannel } = props
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)

  const openUpdateModal = () => setShowUpdateModal(true)
  const closeUpdateModal = () => setShowUpdateModal(false)

  return (
    <div className="col-span-2 rounded-rounded border bg-grey-0 border-grey-20 px-8 py-6">
      <SalesChannelDetailsHeader
        resetDetails={resetDetails}
        salesChannel={salesChannel}
        openUpdateModal={openUpdateModal}
        setShowAddProducts={setShowAddProducts}
      />

      <SalesChannelProductsTable
        salesChannelId={salesChannel.id}
        showAddModal={() => setShowAddProducts(true)}
      />

      {showUpdateModal && (
        <EditSalesChannel
          handleClose={closeUpdateModal}
          salesChannel={salesChannel}
        />
      )}

      {showAddProducts && (
        <SalesChannelProductsSelectModal
          salesChannel={salesChannel}
          handleClose={() => setShowAddProducts(false)}
        />
      )}
    </div>
  )
}

/**
 * Sales channels details page container.
 */
function Details() {
  const [filterText, setFilterText] = useState<string>()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [
    activeSalesChannel,
    setActiveSalesChannel,
  ] = useState<SalesChannel | null>()

  const { store } = useAdminStore()
  const { sales_channels } = useAdminSalesChannels()

  useEffect(() => {
    if (sales_channels && store) {
      if (!activeSalesChannel) {
        setActiveSalesChannel(
          sales_channels.find((sc) => sc.id === store.default_sales_channel_id)
        )
      } else {
        setActiveSalesChannel(
          sales_channels.find((sc) => sc.id === activeSalesChannel.id)
        )
      }
    }
  }, [sales_channels, store, activeSalesChannel?.id])

  const openCreateModal = () => setShowCreateModal(true)
  const closeCreateModal = () => setShowCreateModal(false)

  const resetDetails = () => {
    setActiveSalesChannel(
      sales_channels.find((sc) => sc.id === store?.default_sales_channel_id)
    )
  }

  function defaultChannelsSorter(sc1, sc2) {
    if (sc1.id === store?.default_sales_channel_id) {
      return -1
    }
    if (sc2.id === store?.default_sales_channel_id) {
      return 1
    }

    return sc1.name.localeCompare(sc2.name)
  }

  function filterSalesChannels(channels: SalesChannel[]) {
    if (!filterText) {
      return channels
    }

    return channels.filter((ch) => {
      const filter = filterText.toLowerCase()
      return (
        !!ch.name.toLowerCase().match(filter) ||
        !!ch.description?.toLowerCase().match(filter)
      )
    })
  }

  if (!sales_channels || !activeSalesChannel) {
    return null
  }

  return (
    <div>
      <Link to={"/a/settings"}>
        <div className="flex text-grey-40 hover:text-purple-600 gap-2 items-center mb-2">
          <ArrowLeftIcon />
          <span className="text-small">Back to Settings</span>
        </div>
      </Link>

      <div className="grid grid-cols-3 gap-2 min-h-[960px] w-full pb-8">
        <SalesChannelsList
          filterText={filterText}
          setFilterText={setFilterText}
          openCreateModal={openCreateModal}
          activeChannelId={activeSalesChannel.id}
          setActiveSalesChannel={setActiveSalesChannel}
          salesChannels={filterSalesChannels(sales_channels).sort(
            defaultChannelsSorter
          )}
        />
        {activeSalesChannel && (
          <SalesChannelDetails
            salesChannel={activeSalesChannel}
            resetDetails={resetDetails}
          />
        )}
      </div>

      {showCreateModal && <AddSalesChannelModal onClose={closeCreateModal} />}
    </div>
  )
}

export default Details