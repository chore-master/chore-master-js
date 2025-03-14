import choreMasterAPIAgent from '@/utils/apiAgent'
import React from 'react'

// interface Entity {
//   isFetchedAll: boolean
//   isFetchingAll: boolean
//   list: any[]
//   setList: any
//   fetchAll: () => void
//   getMap: any
// }

// interface EntitiesContextType {
//   entityMap: Record<string, Entity>
//   addEntities: (m: any) => void
// }

// const EntitiesContext = React.createContext<EntitiesContextType>({
//   entityMap: {},
//   addEntities: (m: any) => {},
// })

// export const EntitiesProvider = (props: any) => {
//   const [entityMap, setEntityMap] = React.useState<Record<string, Entity>>({})
//   const setListFactory = (entityKey: string) => (list: any[]) => {
//     setEntityMap((m: any) => ({
//       ...m,
//       [entityKey]: {
//         ...m[entityKey],
//         list,
//       },
//     }))
//   }

//   const fetchAllFactory = (entityKey: string, endpoint: string) => async () => {
//     const isFetchingAll = entityMap[entityKey]?.isFetchingAll
//     if (isFetchingAll) {
//       return
//     }
//     setEntityMap((m: any) => ({
//       ...m,
//       [entityKey]: {
//         ...m[entityKey],
//         isFetchingAll: true,
//       },
//     }))
//     await choreMasterAPIAgent.get(endpoint, {
//       params: {},
//       onFail: ({ message }: any) => {
//         alert(message)
//       },
//       onSuccess: async ({ data }: any) => {
//         setEntityMap((m: any) => ({
//           ...m,
//           [entityKey]: {
//             ...m[entityKey],
//             list: data,
//           },
//         }))
//       },
//     })
//     setEntityMap((m: any) => ({
//       ...m,
//       [entityKey]: {
//         ...m[entityKey],
//         isFetchingAll: false,
//         isFetchedAll: true,
//       },
//     }))
//   }
//   const addEntities = (entityKeyToEntityConfigMap: Map<string, string>) => {
//     const newEntityMap: any = {}
//     for (const [entityKey, entityConfig] of Object.entries(
//       entityKeyToEntityConfigMap
//     )) {
//       if (entityKey in entityMap) {
//         continue
//       }
//       const { endpoint } = entityConfig
//       newEntityMap[entityKey] = {
//         config: entityConfig,
//         isFetchedAll: false,
//         isFetchingAll: false,
//         list: [],
//         setList: setListFactory(entityKey),
//         fetchAll: fetchAllFactory(entityKey, endpoint),
//       }
//     }
//     if (Object.keys(newEntityMap).length > 0) {
//       setEntityMap({
//         ...entityMap,
//         ...newEntityMap,
//       })
//     }
//   }
//   return (
//     <EntitiesContext.Provider value={{ entityMap, addEntities }} {...props} />
//   )
// }

// export const useEntities = (entityKeyToEntityConfigMap: any) => {
//   const { entityMap, addEntities } = React.useContext(EntitiesContext)

//   React.useEffect(() => {
//     addEntities(entityKeyToEntityConfigMap)
//   }, [entityKeyToEntityConfigMap])

//   return {
//     ...entityMap,
//   }
// }

export function useEntity<T>({
  endpoint,
  defaultList,
}: {
  endpoint: string
  defaultList: any
}) {
  const [entities, setEntities] = React.useState<T>(defaultList)
  const [isLoadingEntities, setIsLoadingEntities] = React.useState(false)

  React.useEffect(() => {
    fetchEntities()
  }, [endpoint])

  const fetchEntities = async () => {
    setIsLoadingEntities(true)
    await choreMasterAPIAgent.get(endpoint, {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setEntities(data)
      },
    })
    setIsLoadingEntities(false)
  }

  const upsertEntityByReference = async ({
    isNew,
    upsertedEntity,
  }: {
    isNew: boolean
    upsertedEntity: any
  }) => {
    setIsLoadingEntities(true)
    if (isNew) {
      await choreMasterAPIAgent.post(endpoint, upsertedEntity, {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          setEntities(
            (entities as any).map((entity: any) =>
              entity.reference === upsertedEntity.reference
                ? upsertedEntity
                : entity
            )
          )
        },
      })
    } else {
      await choreMasterAPIAgent.patch(
        `${endpoint}/${upsertedEntity.reference}`,
        upsertedEntity,
        {
          onFail: ({ message }: any) => {
            alert(message)
          },
          onSuccess: () => {
            setEntities(
              (entities as any).map((entity: any) =>
                entity.reference === upsertedEntity.reference
                  ? upsertedEntity
                  : entity
              )
            )
          },
        }
      )
    }
    setIsLoadingEntities(false)
    return upsertedEntity
  }

  const deleteEntityByReference = async (reference: any) => {
    setIsLoadingEntities(true)
    await choreMasterAPIAgent.delete(`${endpoint}/${reference}`, {
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: () => {
        setEntities(
          (entities as any).filter((row: any) => row.reference !== reference)
        )
      },
    })
    setIsLoadingEntities(false)
  }

  const getMapByReference = () => {
    return (entities as any).reduce((m: any, entity: any) => {
      m[entity['reference']] = entity
      return m
    }, {})
  }

  return {
    list: entities,
    setList: setEntities,
    isLoading: isLoadingEntities,
    fetchAll: fetchEntities,
    upsertByReference: upsertEntityByReference,
    deleteByReference: deleteEntityByReference,
    getMapByReference,
  }
}
