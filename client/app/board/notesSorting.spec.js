import assert from 'assert';
import { NotesSorting } from './notesSorting'

describe('NotesSorting', () => {
  describe('when create', () => {
    it('starts with default icons', () => {
        const sorting = new NotesSorting()
        const icons = [
            sorting.sortIcon('good'),
            sorting.sortIcon('bad'),
            sorting.sortIcon('actions'),
        ]
        const expectedIcons = [
            'glyphicon glyphicon-sort sort pull-right',
            'glyphicon glyphicon-sort sort pull-right',
            'glyphicon glyphicon-sort sort pull-right'
        ]
        
        assert.deepEqual(icons, expectedIcons)
    });
  });

  describe('#nextSortDirection', () => {
      describe('when current none direction', () => {
        it('changes direction to desc', () => {
            const sorting = new NotesSorting()
            sorting.nextSortDirection('good')
            const icons = [
                sorting.sortIcon('good'),
            ]
            const expectedIcons = [
                'glyphicon glyphicon-sort-by-attributes-alt sort pull-right',
            ]

            assert.deepEqual(icons, expectedIcons)
        })
      })

      describe('when current asc direction', () => {
        it('changes direction to none', () => {
            const sorting = new NotesSorting('asc')
            sorting.nextSortDirection('bad')
            const icons = [
                sorting.sortIcon('bad'),
            ]
            const expectedIcons = [
                'glyphicon glyphicon-sort sort pull-right',
            ]

            assert.deepEqual(icons, expectedIcons)
        })
      })

      describe('when current desc direction', () => {
        it('changes direction to asc', () => {
            const sorting = new NotesSorting('desc')
            sorting.nextSortDirection('actions')
            const icons = [
                sorting.sortIcon('actions'),
            ]
            const expectedIcons = [
                'glyphicon glyphicon-sort-by-attributes sort pull-right',
            ]

            assert.deepEqual(icons, expectedIcons)
        })
      })
  })

  describe('#sort', () => {
      const notesSample = [
        { voters: ['James'] },
        { voters: ['James', 'Anna', 'Breno'] },
        { voters: ['James','Anna'] },
      ]

      describe('when asc', () => {
          it('asc sorts notes', () => {
              const sorting = new NotesSorting('asc')
              const actual = sorting.sort(notesSample, 'good')
              const expected = [
                { voters: ['James'] },
                { voters: ['James','Anna'] },
                { voters: ['James', 'Anna', 'Breno'] },
              ]

              assert.deepEqual(actual, expected)
          })
      })

      describe('when desc', () => {
        it('desc sorts notes', () => {
            const sorting = new NotesSorting('desc')
            const actual = sorting.sort(notesSample, 'bad')
            const expected = [
                { voters: ['James', 'Anna', 'Breno'] },
                { voters: ['James','Anna'] },
                { voters: ['James'] },
            ]

            assert.deepEqual(actual, expected)
        })
    })

    describe('when none', () => {
        it('return original order', () => {
            const sorting = new NotesSorting('desc')
            const actual = sorting.sort(notesSample, 'actions')

            assert.deepEqual(actual, notesSample)
        })
    })
  })

  describe('#sortIcon', () => {
      describe('when asc', () => {
          it('returns asc icons', () => {
            const sorting = new NotesSorting('asc')
            const icons = [
                sorting.sortIcon('good'),
                sorting.sortIcon('bad'),
                sorting.sortIcon('actions'),
            ]
            const expectedIcons = [
                'glyphicon glyphicon-sort-by-attributes sort pull-right',
                'glyphicon glyphicon-sort-by-attributes sort pull-right',
                'glyphicon glyphicon-sort-by-attributes sort pull-right'
            ]
            
            assert.deepEqual(icons, expectedIcons)
          })
      })

    describe('when desc', () => {
        it('returns desc icons', () => {
          const sorting = new NotesSorting('desc')
          const icons = [
              sorting.sortIcon('good'),
              sorting.sortIcon('bad'),
              sorting.sortIcon('actions'),
          ]
          const expectedIcons = [
              'glyphicon glyphicon-sort-by-attributes-alt sort pull-right',
              'glyphicon glyphicon-sort-by-attributes-alt sort pull-right',
              'glyphicon glyphicon-sort-by-attributes-alt sort pull-right'
          ]
          
          assert.deepEqual(icons, expectedIcons)
        })
    })

    describe('when none', () => {
        it('returns none icons', () => {
          const sorting = new NotesSorting('none')
          const icons = [
              sorting.sortIcon('good'),
              sorting.sortIcon('bad'),
              sorting.sortIcon('actions'),
          ]
          const expectedIcons = [
              'glyphicon glyphicon-sort sort pull-right',
              'glyphicon glyphicon-sort sort pull-right',
              'glyphicon glyphicon-sort sort pull-right'
          ]
          
          assert.deepEqual(icons, expectedIcons)
        })
    })
  })
});
