import { ReactiveVar } from 'meteor/reactive-var';

const ASC = 'asc'
const DESC = 'desc'
const NONE = 'none'

export const NotesSorting = (direction = NONE) => {
    const sortValues = {
        good: new ReactiveVar(direction),
        bad: new ReactiveVar(direction),
        actions: new ReactiveVar(direction),
    }
    const sortCompares = {
        [DESC]: (noteA, noteB) => noteB.voters.length - noteA.voters.length,
        [ASC]: (noteA, noteB) => noteA.voters.length - noteB.voters.length,
        [NONE]: () => 1,
    }
    const sortIcons = {
        [NONE]: 'glyphicon glyphicon-sort sort pull-right',
        [ASC]: 'glyphicon glyphicon-sort-by-attributes sort pull-right',
        [DESC]: 'glyphicon glyphicon-sort-by-attributes-alt sort pull-right',
    }

    const sortDirection = categoryId => sortValues[categoryId].get()

    const sortIcon = categoryId => sortIcons[sortDirection(categoryId)]

    const setSortDirection = (categoryId, direction) => sortValues[categoryId].set(direction)

    const sort = (notes, categoryId) => {
        const direction = sortDirection(categoryId)
        const compare = sortCompares[direction]

        return notes.sort(compare)
    }

    const nextSortDirection = (categoryId) => {
        const currentDirection = sortDirection(categoryId)
    
        if (currentDirection === NONE) {
            return setSortDirection(categoryId, DESC)
        }
    
        if (currentDirection === DESC) {
            return setSortDirection(categoryId, ASC)
        }
    
        return setSortDirection(categoryId, NONE)
    }

    return { sort, sortIcon, nextSortDirection }
}