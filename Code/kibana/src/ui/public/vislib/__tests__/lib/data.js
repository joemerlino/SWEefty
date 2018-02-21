import _ from 'lodash';
import ngMock from 'ng_mock';
import expect from 'expect.js';

import { VislibLibDataProvider } from 'ui/vislib/lib/data';
import 'ui/persisted_state';

const seriesData = {
  'label': '',
  'series': [
    {
      'label': '100',
      'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
    }
  ]
};

const rowsData = {
  'rows': [
    {
      'label': 'a',
      'series': [
        {
          'label': '100',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    },
    {
      'label': 'b',
      'series': [
        {
          'label': '300',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    },
    {
      'label': 'c',
      'series': [
        {
          'label': '100',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    },
    {
      'label': 'd',
      'series': [
        {
          'label': '200',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    }
  ]
};

const colsData = {
  'columns': [
    {
      'label': 'a',
      'series': [
        {
          'label': '100',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    },
    {
      'label': 'b',
      'series': [
        {
          'label': '300',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    },
    {
      'label': 'c',
      'series': [
        {
          'label': '100',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    },
    {
      'label': 'd',
      'series': [
        {
          'label': '200',
          'values': [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }]
        }
      ]
    }
  ]
};

describe('Vislib Data Class Test Suite', function () {
  let Data;
  let persistedState;

  beforeEach(ngMock.module('kibana'));
  beforeEach(ngMock.inject(function (Private, $injector) {
    Data = Private(VislibLibDataProvider);
    persistedState = new ($injector.get('PersistedState'))();
  }));

  describe('Data Class (main)', function () {
    it('should be a function', function () {
      expect(_.isFunction(Data)).to.be(true);
    });

    it('should return an object', function () {
      const rowIn = new Data(rowsData, persistedState);
      expect(_.isObject(rowIn)).to.be(true);
    });
  });


  describe('_removeZeroSlices', function () {
    let data;
    const pieData = {
      slices: {
        children: [
          { size: 30 },
          { size: 20 },
          { size: 0 }
        ]
      }
    };

    beforeEach(function () {
      data = new Data(pieData, persistedState);
    });

    it('should remove zero values', function () {
      const slices = data._removeZeroSlices(data.data.slices);
      expect(slices.children.length).to.be(2);
    });
  });

  describe('Data.flatten', function () {
    let serIn;
    let serOut;

    beforeEach(function () {
      serIn = new Data(seriesData, persistedState);
      serOut = serIn.flatten();
    });

    it('should return an array of value objects from every series', function () {
      expect(serOut.every(_.isObject)).to.be(true);
    });

    it('should return all points from every series', testLength(seriesData));
    it('should return all points from every series in the rows', testLength(rowsData));
    it('should return all points from every series in the columns', testLength(colsData));

    function testLength(inputData) {
      return function () {
        const data = new Data(inputData, persistedState);
        const len = _.reduce(data.chartData(), function (sum, chart) {
          return sum + chart.series.reduce(function (sum, series) {
            return sum + series.values.length;
          }, 0);
        }, 0);

        expect(data.flatten()).to.have.length(len);
      };
    }
  });

  describe('geohashGrid methods', function () {
    let data;
    const geohashGridData = {
      hits: 3954,
      rows: [{
        title: 'Top 5 _type: apache',
        label: 'Top 5 _type: apache',
        geoJson: {
          type: 'FeatureCollection',
          features: [],
          properties: {
            min: 2,
            max: 331,
            zoom: 3,
            center: [
              47.517200697839414,
              -112.06054687499999
            ]
          }
        },
      }, {
        title: 'Top 5 _type: nginx',
        label: 'Top 5 _type: nginx',
        geoJson: {
          type: 'FeatureCollection',
          features: [],
          properties: {
            min: 1,
            max: 88,
            zoom: 3,
            center: [
              47.517200697839414,
              -112.06054687499999
            ]
          }
        },
      }]
    };

    beforeEach(function () {
      data = new Data(geohashGridData, persistedState);
    });

    describe('getVisData', function () {
      it('should return the rows property', function () {
        const visData = data.getVisData();
        expect(visData).to.eql(geohashGridData.rows);
      });
    });

    describe('getGeoExtents', function () {
      it('should return the min and max geoJson properties', function () {
        const minMax = data.getGeoExtents();
        expect(minMax.min).to.be(1);
        expect(minMax.max).to.be(331);
      });
    });
  });

  describe('null value check', function () {
    it('should return false', function () {
      const data = new Data(rowsData, persistedState);
      expect(data.hasNullValues()).to.be(false);
    });

    it('should return true', function () {
      const nullRowData = { rows: rowsData.rows.slice(0) };
      nullRowData.rows.push({
        'label': 'e',
        'series': [
          {
            'label': '200',
            'values': [{ x: 0, y: 1 }, { x: 1, y: null }, { x: 2, y: 3 }]
          }
        ]
      });

      const data = new Data(nullRowData, persistedState);
      expect(data.hasNullValues()).to.be(true);
    });
  });
});
