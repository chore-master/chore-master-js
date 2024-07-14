import choreMasterAPIAgent from '@/utils/apiAgent'
import React from 'react'

interface Entity {
  isFetchedAll: boolean
  isFetchingAll: boolean
  list: any[]
  setList: any
  fetchAll: () => void
  getMap: any
}

interface EntitiesContextType {
  entityMap: Record<string, Entity>
  addEntities: (m: any) => void
}

const EntitiesContext = React.createContext<EntitiesContextType>({
  entityMap: {},
  addEntities: (m: any) => {},
})

export const EntitiesProvider = (props: any) => {
  const [entityMap, setEntityMap] = React.useState<Record<string, Entity>>({})
  const setListFactory = (entityKey: string) => (list: any[]) => {
    setEntityMap((m: any) => ({
      ...m,
      [entityKey]: {
        ...m[entityKey],
        list,
      },
    }))
  }

  const fetchAllFactory = (entityKey: string, endpoint: string) => async () => {
    const isFetchingAll = entityMap[entityKey]?.isFetchingAll
    if (isFetchingAll) {
      return
    }
    setEntityMap((m: any) => ({
      ...m,
      [entityKey]: {
        ...m[entityKey],
        isFetchingAll: true,
      },
    }))
    await choreMasterAPIAgent.get(endpoint, {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setEntityMap((m: any) => ({
          ...m,
          [entityKey]: {
            ...m[entityKey],
            list: data,
          },
        }))
      },
    })
    setEntityMap((m: any) => ({
      ...m,
      [entityKey]: {
        ...m[entityKey],
        isFetchingAll: false,
        isFetchedAll: true,
      },
    }))
  }
  const addEntities = (entityKeyToEntityConfigMap: Map<string, string>) => {
    const newEntityMap: any = {}
    for (const [entityKey, entityConfig] of Object.entries(
      entityKeyToEntityConfigMap
    )) {
      if (entityKey in entityMap) {
        continue
      }
      const { endpoint } = entityConfig
      newEntityMap[entityKey] = {
        config: entityConfig,
        isFetchedAll: false,
        isFetchingAll: false,
        list: [],
        setList: setListFactory(entityKey),
        fetchAll: fetchAllFactory(entityKey, endpoint),
      }
    }
    if (Object.keys(newEntityMap).length > 0) {
      setEntityMap({
        ...entityMap,
        ...newEntityMap,
      })
    }
  }
  return (
    <EntitiesContext.Provider value={{ entityMap, addEntities }} {...props} />
  )
}

export const useEntities = (entityKeyToEntityConfigMap: any) => {
  const { entityMap, addEntities } = React.useContext(EntitiesContext)

  React.useEffect(() => {
    addEntities(entityKeyToEntityConfigMap)
  }, [entityKeyToEntityConfigMap])

  return {
    ...entityMap,
  }
}
