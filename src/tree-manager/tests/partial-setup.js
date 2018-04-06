export const grandParent = '1'

export const parent1 = '1-1'
export const parent2 = '1-2'
export const parents = [parent1, parent2]

export const childrenOfParent1 = ['1-1-1', '1-1-2']
export const childrenOfParent2 = ['1-2-1', '1-2-2', '1-2-3']
export const children = [...childrenOfParent1, ...childrenOfParent2]

export const assertTreeInExpectedState = (t, manager, expected) => {
  const { checked = [], partial = [], unchecked = [], nonPartial = [] } = expected

  checked.forEach(c => t.truthy(manager.getNodeById(c).checked, `Expected node ${c} to be in checked state`))
  partial.forEach(c => t.truthy(manager.getNodeById(c).partial, `Expected node ${c} to be in partial state`))
  unchecked.forEach(c => t.falsy(manager.getNodeById(c).checked, `Expected node ${c} to be in unchecked state`))
  nonPartial.forEach(c => t.falsy(manager.getNodeById(c).partial, `Expected node ${c} to be in non-partial state`))
}
