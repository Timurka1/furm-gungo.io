(function() {
  $(function() {
    var flagLayoutAdmin, refreshErrorCount, refreshSystemInfo;
    flagLayoutAdmin = window.location.pathname.indexOf('/admin') === 0;
    if (!flagLayoutAdmin) {
      return;
    }
    soundNewMatch = undefined;;
    soundNewDeposit = undefined;;
    soundNewDepositorsRoulette = undefined;;
    refreshErrorCount = 0;
    refreshSystemInfo = function() {
      if (!$('.selector-system-status, .selector-bot-status, .selector-today-comission, .selector-sending-errors').size()) {
        return;
      }
      return $.ajax({
        type: 'POST',
        url: '/refresh/system-info',
        data: {
          systemStatus: $('.selector-system-status').hasClass('label-success') ? 'success' : ($('.selector-system-status').hasClass('label-danger') ? 'danger' : 'default'),
          botStatus: $('.selector-bot-status').hasClass('label-success') ? 'success' : ($('.selector-bot-status').hasClass('label-danger') ? 'danger' : 'default'),
          lastMatchUpdatedAt: $('.selector-today-comission').data('last-match-updated-at'),
          sendingErrors: $('.selector-sending-errors').text()
        },
        success: function(response) {
          refreshErrorCount = 0;
          $('.selector-system-status').removeClass('label-default label-success label-danger').addClass('label-' + response.systemStatus);
          $('.selector-bot-status').removeClass('label-default label-success label-danger').addClass('label-' + response.botStatus);
          $('.selector-today-comission').data('last-match-updated-at', response.lastMatchUpdatedAt);
          if (response.todayComission != null) {
            $('.selector-today-comission').text('$' + response.todayComission / 100);
          }
          if (response.sendingErrors != null) {
            $('.selector-sending-errors').text(response.sendingErrors);
          }
          return setTimeout(refreshSystemInfo, 100);
        },
        error: function() {
          refreshErrorCount++;
          $('.selector-system-status, .selector-bot-status').removeClass('label-default label-success label-danger').addClass('label-default');
          return setTimeout(refreshSystemInfo, refreshErrorCount > 3 ? 30000 : 100);
        }
      });
    };
    refreshSystemInfo();
    $(document).on('render', '.selector-timer', function(e, seconds) {
      var $this, minutes;
      $this = $(this);
      minutes = parseInt(seconds / 60);
      seconds = seconds % 60;
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return $this.text(minutes + ' : ' + seconds);
    });
    $(document).on('click', '.selector-system-reboot', function(e) {
      if (confirm('Warning! Do you really want reboot system?')) {
        return $.ajax({
          type: 'POST',
          url: '/system-reboot',
          success: function() {
            return alert('Reboot process started.');
          },
          error: function() {
            return alert('Error occured while requesting reboot system');
          }
        });
      }
    });
    $(document).on('click', '.selector-current-match-clear', function(e) {
      if (confirm('Warning! Do you really want clear current match and reboot system?')) {
        return $.ajax({
          type: 'POST',
          url: '/current-match-clear',
          success: function() {
            return alert('Current match items was deleted and reboo process started.');
          },
          error: function() {
            return alert('Error occured while requesting');
          }
        });
      }
    });
    $(document).on('click', '.selector-match-flag-outgoing-success', function(e) {
      var $this;
      $this = $(this);
      return $.ajax({
        type: 'POST',
        url: '/flag-outgoung-success',
        data: {
          match_id: $this.data('match-id')
        },
        success: function() {
          return $this.replaceWith('<span class="label label-info">waiting</span>');
        },
        error: function() {
          return alert('Error occured while requesting');
        }
      });
    });
    $(document).on('click', '.selector-clear-sending-errors', function(e) {
      var $this;
      $this = $(this);
      if (confirm('Do you want mark all sending errors as processed?')) {
        return $.ajax({
          type: 'POST',
          url: '/clear-sending-errors',
          success: function() {
            return window.location.reload();
          },
          error: function() {
            return alert('Error occured while requesting');
          }
        });
      }
    });
    $(document).on('show.bs.modal', '.selector-match-user-tradeurl', function(e) {
      var $target, $this;
      $this = $(this);
      $target = $(e.relatedTarget);
      $this.find('[name=steamid]').val($target.data('steamid'));
      $this.find('[name=tradeurl]').val($target.data('tradeurl'));
      return $this.find('.modal-title').html('Tradeurl for ' + $target.html());
    });
    $(document).on('shown.bs.modal', '.selector-match-user-tradeurl', function(e) {
      return $(this).find('.form-control').trigger('focus');
    });
    $(document).on('click', '.selector-match-user-tradeurl .btn-primary', function(e) {
      return $('.selector-match-user-tradeurl form').trigger('submit');
    });
    $(document).on('submit', '.selector-match-user-tradeurl form', function(e) {
      var $this, steamid, tradeurl;
      e.preventDefault();
      $this = $(this);
      steamid = $this.find('[name=steamid]').val();
      tradeurl = $this.find('[name=tradeurl]').val();
      return $.ajax({
        type: 'POST',
        data: $this.serialize(),
        headers: {
          'X-CSRF-TOKEN': $('body').data('token')
        },
        url: '/tradeurl',
        success: function(response) {
          $this.closest('.selector-match-user-tradeurl').modal('hide');
          test = $('[data-steamid="' + steamid + '"][data-tradeurl]');;
          return $('[data-steamid="' + steamid + '"][data-tradeurl]').attr('data-tradeurl', tradeurl).data('tradeurl', tradeurl);
        },
        error: function() {
          return alert('Error occured while requesting.');
        }
      });
    });
    $(document).on('show.bs.modal', '.selector-comission-items', function(e) {
      var $this;
      $this = $(this);
      $this.find('.modal-title').html('Comission items for day ' + $(e.relatedTarget).data('date'));
      $this.find('.modal-body').html('...');
      return $.ajax({
        type: 'POST',
        url: '/admin/comission/items',
        data: {
          date: $(e.relatedTarget).data('date')
        },
        success: function(response) {
          return $this.find('.modal-body').html(response);
        },
        error: function() {
          return alert('Error occured while requesting');
        }
      });
    });
    $(document).on('submit', '.selector-prices-form-filter', function(e, replace) {
      var $this;
      if (replace == null) {
        replace = true;
      }
      e.preventDefault();
      $this = $(this);
      clearTimeout($this.data('timeout'));
      return $.ajax({
        type: 'POST',
        data: $this.serialize(),
        url: window.location.href,
        success: function(response) {
          var $rows;
          if (replace) {
            $('.selector-prices-rows').html(response.rows);
            $('.selector-prices-pagination').html(response.pagination);
          } else {
            $rows = $(response.rows);
            $rows.filter('.selector-price-row').each(function() {
              var $newRow, $oldRow, descriptionId;
              $newRow = $(this);
              descriptionId = $newRow.data('description-id');
              $oldRow = $('.selector-prices-rows').find('.selector-price-row[data-description-id=' + descriptionId + ']');
              if ($oldRow.size() && ($oldRow.html() !== $newRow.html())) {
                return $oldRow.replaceWith($newRow);
              }
            });
          }
          return $this.data('timeout', setTimeout((function() {
            return $('.selector-prices-form-filter').trigger('submit', false);
          }), 5000));
        },
        error: function() {
          $('.selector-prices-rows').html('<tr><td colspan="7"><div class="alert alert-danger"><strong>Error.</strong> An error occured while running query.</div></td></tr>');
          return $this.data('timeout', setTimeout((function() {
            return $('.selector-prices-form-filter').trigger('submit');
          }), 5000));
        }
      });
    });
    $('.selector-prices-form-filter').trigger('submit');
    $(document).on('keyup', '.selector-prices-form-filter', function(e) {
      var $this;
      $this = $(this);
      clearTimeout($this.data('timeout'));
      return $this.data('timeout', setTimeout(function() {
        $('.selector-prices-form-filter [name=page]').val('');
        return $this.trigger('submit');
      }, 334));
    });
    $(document).on('show.bs.modal', '.selector-price-modal', function(e) {
      var $row;
      $row = $(e.relatedTarget).closest('.selector-price-row');
      $('.selector-price-modal [name=price_at][value=' + ($row.data('price-at')) + ']').prop('checked', true).trigger('change');
      $('.selector-price-modal [name=price]').val($row.data('price'));
      $('.selector-price-modal [name=description_id]').val($row.data('description-id'));
      return $('.selector-price-modal .selector-price-title').text($row.data('market-hash-name'));
    });
    $(document).on('change', '.selector-price-modal [name=price_at]', function(e) {
      if (parseInt($(this).val())) {
        return $('.selector-price-modal [name=price]').removeAttr('required').attr('disabled', '').closest('.form-group').slideUp();
      } else {
        return $('.selector-price-modal [name=price]').attr('required', '').removeAttr('disabled').closest('.form-group').slideDown();
      }
    });
    $(document).on('click', '.selector-price-modal .btn-primary', function(e) {
      return $('.selector-price-modal form').trigger('submit');
    });
    $(document).on('submit', '.selector-price-modal form', function(e) {
      var $this;
      e.preventDefault();
      $this = $(this);
      return $.ajax({
        type: 'POST',
        data: $this.serialize(),
        url: window.location.pathname,
        success: function(response) {
          $this.closest('.selector-price-modal').modal('hide');
          return $('.selector-prices-form-filter').trigger('submit');
        },
        error: function() {
          return alert('Error occured while saving price.');
        }
      });
    });
    $(document).on('show.bs.modal', '.selector-price-add-modal', function(e) {
      return $('.selector-price-add-modal .form-control').val('');
    });
    $(document).on('click', '.selector-price-add-modal .btn-primary', function(e) {
      return $('.selector-price-add-modal form').trigger('submit');
    });
    $(document).on('submit', '.selector-price-add-modal form', function(e) {
      var $this;
      e.preventDefault();
      $this = $(this);
      return $.ajax({
        type: 'POST',
        data: $this.serialize(),
        url: window.location.pathname,
        success: function(response) {
          $this.closest('.selector-price-add-modal').modal('hide');
          $('.selector-prices-form-filter [name=name]').val($('.selector-price-add-modal [name=market_hash_name]').val());
          $('.selector-prices-form-filter [name=page]').val('');
          return $('.selector-prices-form-filter').trigger('submit');
        },
        error: function() {
          return alert('Error occured while saving price.');
        }
      });
    });
    $(document).on('click', '.selector-description-remove', function(e) {
      if (confirm('Do you really want remove this record?')) {
        return $.ajax({
          type: 'POST',
          data: {
            'description_id': $(this).closest('[data-description-id]').data('description-id')
          },
          url: window.location.pathname + '/remove',
          success: function(response) {
            return $('.selector-prices-form-filter').trigger('submit');
          },
          error: function() {
            return alert('Error occured while removing record.');
          }
        });
      }
    });
    $(document).on('focus', '.selector-setting .selector-setting-value', function(e) {
      var $this;
      $this = $(this);
      if ($this.data('setting-value-original') == null) {
        return $this.data('setting-value-original', $this.html());
      }
    });
    $(document).on('blur keyup paste input', '.selector-setting .selector-setting-value', function(e) {
      var $this;
      $this = $(this);
      if ($this.html() !== $this.data('setting-value-original')) {
        return $this.closest('.selector-setting').find('.selector-setting-save, .selector-setting-cancel').prop('disabled', false);
      } else {
        return $this.closest('.selector-setting').find('.selector-setting-save, .selector-setting-cancel').prop('disabled', true);
      }
    });
    $(document).on('click', '.selector-setting .selector-setting-cancel', function(e) {
      var $value;
      $value = $(this).closest('.selector-setting').find('.selector-setting-value');
      return $value.html($value.data('setting-value-original')).trigger('blur');
    });
    $(document).on('click', '.selector-setting .selector-setting-save', function(e) {
      var $setting, $this, $value;
      $this = $(this);
      $setting = $this.closest('.selector-setting');
      $value = $setting.find('.selector-setting-value');
      $setting.find('.selector-setting-save, .selector-setting-cancel').prop('disabled', true);
      $value.removeAttr('contenteditable');
      return $.ajax({
        type: 'POST',
        url: window.location.href,
        data: {
          setting_key: $setting.data('setting-key'),
          setting_value: $value.html()
        },
        success: function() {
          $value.attr('contenteditable', '');
          return $value.removeData('setting-value-original');
        },
        error: function() {
          $value.attr('contenteditable', '');
          $this.closest('.selector-setting').find('.selector-setting-save, .selector-setting-cancel').prop('disabled', false);
          return alert('Error occured while saving setting value.');
        }
      });
    });
    $(document).on('refresh', '.selector-bots-rows', function(e) {
      var $this;
      $this = $(this);
      clearTimeout($this.data('timeout'));
      return $.ajax({
        type: 'POST',
        url: window.location.href,
        success: function(response) {
          $('.selector-bots-rows').html(response);
          return $this.data('timeout', setTimeout(function() {
            return $this.trigger('refresh');
          }, 1000));
        },
        error: function() {
          $('.selector-prices-rows').html('<tr><td colspan="6"><div class="alert alert-danger"><strong>Error.</strong> An error occured while running query.</div></td></tr>');
          return $this.data('timeout', setTimeout((function() {
            return $('.selector-prices-form-filter').trigger('submit');
          }), 5000));
        }
      });
    });
    $('.selector-bots-rows').trigger('refresh');
    $(document).on('show.bs.modal', '.selector-bot-settings-modal', function(e) {
      var bot_id;
      bot_id = $(e.relatedTarget).data('bot-id');
      if (!bot_id) {
        $('.selector-bot-settings-modal .modal-title').text('New bot settings');
        $('.selector-bot-settings-modal .btn-primary').html('<i class="fa fa-plus"></i> Add');
        $('.selector-bot-settings-modal .form-control').val('');
        return $('.selector-bot-settings-modal [name=id]').val('');
      } else {
        $('.selector-bot-settings-modal .modal-title').text('Edit bot settings');
        $('.selector-bot-settings-modal .btn-primary').html('<i class="fa fa-check"></i> Save');
        $('.selector-bot-settings-modal .form-control').val('');
        $('.selector-bot-settings-modal [name=id]').val(bot_id);
        $('.selector-bot-settings-modal [name=login]').val($(e.relatedTarget).data('bot-login'));
        $('.selector-bot-settings-modal [name=password]').val($(e.relatedTarget).data('bot-password'));
        return $('.selector-bot-settings-modal [name=tradeurl]').val($(e.relatedTarget).data('bot-tradeurl'));
      }
    });
    $(document).on('click', '.selector-bot-settings-modal .btn-primary', function(e) {
      return $('.selector-bot-settings-modal form').trigger('submit');
    });
    $(document).on('submit', '.selector-bot-settings-modal form', function(e) {
      var $checkFormControls, $this;
      e.preventDefault();
      $this = $(this);
      $checkFormControls = $('.selector-bot-settings-modal .form-control');
      if ($('.selector-bot-settings-modal [name=id]').val() !== '') {
        $checkFormControls = $checkFormControls.not('[name=sentry]');
      }
      if ($checkFormControls.filter(function() {
        return $(this).val() === '';
      }).length) {
        alert('Fill all fields, please.');
        return false;
      }
      return $.ajax({
        type: 'POST',
        data: new FormData($this[0]),
        url: window.location.href,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
          $this.closest('.selector-bot-settings-modal').modal('hide');
          return $('.selector-bots-rows').trigger('refresh');
        },
        error: function() {
          return alert('Error occured while saving bot.');
        }
      });
    });
    return $(document).on('click', '.selector-bot-remove', function(e) {
      if (confirm('Do you really want remove this bot?')) {
        return $.ajax({
          type: 'POST',
          data: {
            'bot_id': $(this).data('bot-id')
          },
          url: window.location.href + '/remove',
          success: function(response) {
            return $('.selector-bots-rows').trigger('refresh');
          },
          error: function() {
            return alert('Error occured while removing bot.');
          }
        });
      }
    });
  });

}).call(this);

(function() {
  $(function() {
    var currencyMultiplier, processMatch, processNotifications, socket, wsInit;
    if ($.fn.tooltip) {
      $('[data-toggle="tooltip"]').tooltip();
    }
    currencyMultiplier = $('body').data('currency-multiplier');
    socket = void 0;
    wsInit = function() {
      var domain, e;
      try {
        domain = $('body').data('websockets-domain');
       
        socket.onmessage = function(e) {
          var $maintenance, data;
          try {
            data = JSON.parse(e.data);
            if (data.notifications != null) {
              processNotifications(data.notifications_user, data.notifications);
            }
            if (data.sound != null) {
              if (soundNewMatch && soundNewDeposit && soundNewDepositorsRoulette) {
                if (localStorage && parseInt(localStorage.volumeActive)) {
                  if (data.sound === 'new_match') {
                    soundNewMatch.play();
                  }
                  if (data.sound === 'new_deposit') {
                    soundNewDeposit.play();
                  }
                  if ((data.sound === 'depositors_roulette') && (!$('.selector-current-match').find('.selector-depositors-roulette.used').size())) {
                    soundNewDepositorsRoulette.play();
                  }
                }
              }
            }
            if (data.match != null) {
              processMatch(data.match);
            }
            if (data.duration != null) {
              $('.selector-timer:not(.used)').trigger('render', parseInt(data.duration / 1000));
            }
            if (data.timer != null) {
              if ($('.selector-timer:not(.used)').size()) {
                if ('opened' === $('.selector-current-match').data('current-match-status')) {
                  setTimeout(function() {
                    return $('.selector-current-match').find('.game-over').slideDown();
                  }, data.timer);
                }
              }
              $('.selector-timer:not(.used)').trigger('init', parseInt(data.timer));
            }
            if (data.maintenance !== $('body').data('maintenance')) {
              $('.maintenance').remove();
              if (parseInt(data.maintenance)) {
                $maintenance = $($('.selector-template-maintenance').text());
                $('.content-block').append($maintenance);
                $('.selector-current-match').hide();
              } else {
                $('.maintenance').remove();
                $('.selector-current-match').show();
              }
              $('body').data('maintenance', data.maintenance);
            }
            if (data.online != null) {
              $('.selector-online-users').text(data.online);
            }
            if (data.statTodayMatches != null) {
              $('.selector-stat-today-matches').text(data.statTodayMatches);
            }
            if (data.statTodayItems != null) {
              $('.selector-stat-today-items').text(data.statTodayItems);
            }
            if (data.statMaxSum != null) {
              $('.selector-stat-max-sum').text(parseInt(data.statMaxSum / 100 * currencyMultiplier));
            }
            if (data.statTodayPlayers != null) {
              $('.selector-stat-today-players').text(data.statTodayPlayers);
            }
            if (data.queue != null) {
              if (parseInt(data.queue)) {
                $('.selector-queue-block .selector-queue').text(data.queue);
                return $('.selector-queue-block').slideDown();
              } else {
                return $('.selector-queue-block').slideUp();
              }
            }
          } catch (_error) {
            e = _error;
            return console.log(e);
          }
        };
        return socket.onclose = function() {
          console.log('WebSocket connection is closed');
          return setTimeout(wsInit, 5000);
        };
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    };
    wsInit();
    processMatch = function(match) {
      var $currentMatch, $depositor, $rate, depositor, i, index, j, k, len, len1, len2, rate, ref, ref1, ref2, renderRate, steamid;
      renderRate = function(rate) {
        var $item, $rate, i, item, len, ref;
        $rate = $($('.selector-template-current-rate').text());
        $rate.attr('data-rate-at', rate.created_at);
        $rate.attr('data-depositor-steamid', rate.steamid_depositor);
        $rate.find('.selector-rate-depositor-image').attr('src', match.depositors[rate.steamid_depositor].steamavatarfull).attr('alt', match.depositors[rate.steamid_depositor].steampersonaname).attr('title', match.depositors[rate.steamid_depositor].steampersonaname);
        ref = rate.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          $item = $($('.selector-template-current-item').text());
          $item.find('.selector-current-item-image').attr('src', 'https://steamcommunity-a.akamaihd.net/economy/image/class/' + item.appid + '/' + item.classid + '/70fx35f').attr('alt', item.market_hash_name).attr('title', item.market_hash_name);
          $item.find('.selector-current-item-name').text(item.market_hash_name);
          $item.find('.selecto-current-item-price').text(item.price / 100 * currencyMultiplier);
          $rate.find('.selector-items').prepend($item);
        }
        $rate.find('.selector-rate-items-count').text(rate.items.length);
        $rate.find('.selector-items [data-item-id]:first').removeClass('rate').addClass('rate-head');
        $rate.find('.selector-items [data-item-id]:not(:first)').removeClass('rate-head').addClass('rate').children('.title').remove();
        $rate.find('.selector-current-item-depositor').attr('href', match.depositors[rate.steamid_depositor].steamprofileurl).text(match.depositors[rate.steamid_depositor].steampersonaname);
        $rate.find('.selector-curren-item-price').text((rate.items.length < 2 ? rate.items[0].price : rate.items.reduce(function(a, b) {
          return (a.price != null ? a.price : a) + (b.price != null ? b.price : b);
        })) / 100 * currencyMultiplier);
        $rate.find('.selector-chance').text(parseInt(match.depositors[rate.steamid_depositor].chance * 10000) / 100);
        $rate.find('.selector-rate-tickets-from').text(rate.tickets_from);
        $rate.find('.selector-rate-tickets-to').text(rate.tickets_to);
        return $rate;
      };
      $currentMatch = $('.selector-current-match');
      if ((match.id !== $currentMatch.data('current-match-id')) || (match.status !== $currentMatch.data('current-match-status'))) {
        if ('done' === match.status) {
          return;
        }
        if (('closed' === $currentMatch.data('current-match-status')) && $currentMatch.find('.before_drawing .head .title span.name.not-done').size()) {
          $currentMatch.find('.selector-depositors-roulette .players').trigger("transitionend");
          $currentMatch.find('.selector-depositors-roulette .players').trigger("webkitTransitionEnd");
          $currentMatch.find('.selector-depositors-roulette .players').trigger("oTransitionEnd");
          $currentMatch.find('.selector-depositors-roulette .players').trigger("MSTransitionEnd");
        }
        $currentMatch = $($('.selector-template-current-match').text());
        $currentMatch.attr('data-current-match-id', match.id);
        $currentMatch.attr('data-current-match-status', match.status);
        $currentMatch.find('[data-visible-at-status]').hide().filter('[data-visible-at-status="' + match.status + '"]').show();
        $currentMatch.find('.selector-current-match-id').text(('00000' + match.id).slice(-5));
        $currentMatch.find('.selector-match-random').text(match.random);
        $currentMatch.find('.selector-match-hash').text(match.hash);
        ref = match.rates;
        for (i = 0, len = ref.length; i < len; i++) {
          rate = ref[i];
          $currentMatch.find('.selector-rates').prepend(renderRate(rate));
        }
        $currentMatch.find('.game-over').hide();
        $('.selector-current-match').replaceWith($currentMatch);
      }
      ref1 = match.rates;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        rate = ref1[j];
        if (!$('.selector-current-match .selector-rate[data-rate-at="' + rate.created_at + '"][data-depositor-steamid="' + rate.steamid_depositor + '"]').size()) {
          $rate = renderRate(rate);
          $rate.hide();
          $('.selector-current-match .selector-rates').prepend($rate);
          $rate.slideDown();
        }
      }
      $currentMatch.find('.selector-items-counter').text(match.countOfItems);
      $currentMatch.find('.selector-items-progress').css('width', (match.countOfItems / ($currentMatch.find('.selector-items-progress').attr('aria-valuemax')) * 100) + '%');
      $currentMatch.find('.selector-items-progress-text').css('left', $currentMatch.find('.selector-items-progress').width());
      $currentMatch.find('.selector-current-match-prizepool').text(match.sumOfDeposits / 100 * currencyMultiplier);
      if ($currentMatch.find('.selector-rates').children().size()) {
        $currentMatch.find('.begin-game').removeClass('right');
        $currentMatch.find('.selector-investments-deposit span.first').removeClass('active');
        $currentMatch.find('.selector-investments-deposit span.not-first').addClass('active');
      }
      if (localStorage && parseInt(localStorage.volumeActive)) {
        $currentMatch.find('.volume').addClass('active');
      }
      if ($currentMatch.find('.investments').size()) {
        steamid = $currentMatch.find('.investments').data('steamid');
        if (match.depositors[steamid] != null) {
          $currentMatch.find('.selector-depositor-items-counter').text(match.depositors[steamid].count);
          $currentMatch.find('.selector-depositor-chance').text(parseInt(match.depositors[steamid].chance * 10000) / 100);
        }
      }
      for (depositor in match.depositors) {
        $currentMatch.find('.selector-rate[data-depositor-steamid="' + depositor + '"] .selector-chance').text(parseInt(match.depositors[depositor].chance * 10000) / 100);
      }
      $currentMatch.find('.selector-rates .selector-items').removeClass('first second third');
      $currentMatch.find('.selector-rates :nth-child(3n-2) .selector-items').addClass('first');
      $currentMatch.find('.selector-rates :nth-child(3n-1) .selector-items').addClass('second');
      $currentMatch.find('.selector-rates :nth-child(3n) .selector-items').addClass('third');
      if (('closed' === $currentMatch.data('current-match-status')) && $currentMatch.find('.selector-depositors-roulette:not(.used)').size()) {
        $currentMatch.find('.selector-depositors-roulette').addClass('used');
        ref2 = match.depositors_roulette.split(',');
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          depositor = ref2[k];
          $depositor = $($('.selector-template-roulette-item').text());
          $depositor.find('.selector-roulette-depositor-image').attr('src', match.depositors[depositor] ? match.depositors[depositor].steamavatarfull : depositor).attr('alt', match.depositors[depositor] ? match.depositors[depositor].steampersonaname : depositor).attr('title', match.depositors[depositor] ? match.depositors[depositor].steampersonaname : depositor);
          $currentMatch.find('.selector-depositors-roulette .players').append($depositor);
        }
        $currentMatch.find('.selector-depositors-roulette .players').append($currentMatch.find('.selector-depositors-roulette .players').html());
        $currentMatch.find('.selector-depositors-roulette .players').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e) {
          var $winnerModal;
          if (!$currentMatch.find('.selector-match-winner-link.not-done').size()) {
            return;
          }
          $currentMatch.find('.selector-match-winner-link.not-done').removeClass('not-done');
          steamid = match.depositors_roulette.split(',').pop();
          depositor = match.depositors[steamid];
          $currentMatch.find('.selector-match-winner-link').text(depositor.steampersonaname).attr('href', depositor.steamprofileurl);
          $currentMatch.find('.selector-match-winner-ticket').text(match.winner_ticket);
          if ($currentMatch.find('.investments').size()) {
            if (steamid === $currentMatch.find('.investments').data('steamid')) {
              $winnerModal = $($('.selector-template-winner').text());
              $('body').append($winnerModal);
              $winnerModal.trigger('modal-show');
            }
          }
          $('.selector-lastwinner-image').attr('src', depositor.steamavatarfull).attr('alt', depositor.steampersonaname).attr('title', depositor.steampersonaname);
          $('.selector-lastwinner-name').attr('href', depositor.steamprofileurl).text(depositor.steampersonaname);
          $('.selector-lastwinner-sum').text(match.sumOfDeposits / 100 * currencyMultiplier);
          $('.selector-lastwinner-chance').text(parseInt(depositor.chance * 10000) / 100);
          return setTimeout(function() {
            return $currentMatch.find('.selector-depositors-roulette').addClass('done');
          }, 5000);
        });
        index = parseInt(Math.random() * 10);
        console.log($('.selector-depositors-roulette .players:visible').size());
        return setTimeout(function() {
          console.log($('.selector-depositors-roulette .players:visible').size());
          $('.selector-depositors-roulette .players').addClass('done' + index);
          return console.log($('.selector-depositors-roulette .players:visible').size());
        }, 334);
      }
    };
    processNotifications = function(notifications_user, notifications) {
      var $notification, i, len, notification;
      for (i = 0, len = notifications.length; i < len; i++) {
        notification = notifications[i];
        $notification = $($('.selector-template-notification').text());
        $notification.attr('data-notification-id', notification.id);
        $notification.find('.selector-notification-message').html(notification.message);
        $notification.find('.selector-notification-user-name').text(notifications_user.steampersonaname);
        $notification.find('.selector-notification-user-image').attr('src', notifications_user.steamavatar).attr('alt', notifications_user.steampersonaname).attr('title', notifications_user.steampersonaname);
        $('body').append($notification);
      }
      return $('.selector-notification-modal').first().trigger('modal-show');
    };
    $(document).on('init', '.selector-timer', function(e, duration) {
      var $this, interval, mainCycle, start;
      $this = $(this);
      start = new Date();
      interval = void 0;
      mainCycle = function() {
        var minutes, now, seconds;
        now = new Date();
        if (now - start < duration) {
          minutes = parseInt(((start - now + duration) / 1000) / 60 % 60);
          seconds = Math.round(((start - now + duration) / 1000) % 60);
          return $this.trigger('render', minutes * 60 + seconds);
        } else {
          $this.trigger('render', 0);
          clearInterval(interval);
          return $this.removeClass('used');
        }
      };
      interval = setInterval(mainCycle, 1000);
      mainCycle();
      return $this.addClass('used');
    });
    $(document).on('hidden.bs.modal', '.selector-winner-modal', function(e) {
      return $(this).remove();
    });
    $(document).on('hidden.bs.modal', '.selector-notification-modal', function(e) {
      var $this, notification_id;
      $this = $(this);
      notification_id = $this.data('notification-id');
      $this.remove();
      if ($.fn.modal) {
        $('.selector-notification-modal').first().modal('show');
      } else {
        $('.selector-notification-modal').first().trigger('modal-show');
      }
      if (!notification_id) {
        return;
      }
      return $.ajax({
        type: 'POST',
        data: {
          notification_id: notification_id
        },
        url: '/notification'
      });
    });
    if ($('.history-matches').size()) {
      return $(window).on('scroll', function(e) {
        var page;
        if ((!$('.history-matches').data('downloading')) && (!$('.history-matches').data('end')) && ($(window).scrollTop() + $(window).height() >= $(document).height() - 100)) {
          $('.history-matches').data('downloading', true);
          page = $('.history-matches').data('page');
          return $.ajax({
            type: 'GET',
            url: window.location.href,
            data: {
              page: page ? page : 2
            },
            success: function(response) {
              $('.history-matches').append(response);
              $('.history-matches').data('page', 1 + (page ? page : 2));
              $('.history-matches').data('downloading', false);
              if (!response.length) {
                return $('.history-matches').data('end', true);
              }
            },
            error: function() {
              console.log(error);
              return $('.history-matches').data('downloading', false);
            }
          });
        }
      });
    }
  });

}).call(this);

(function() {
  $(function() {
    var flagLayoutCsgohot;
    flagLayoutCsgohot = $('body').hasClass('cgjp-layout');
    if (!flagLayoutCsgohot) {
      return;
    }
    soundNewMatch = new Audio('/sounds/sound_new_match.wav');;
    soundNewDeposit = new Audio('/sounds/sound_new_deposit.wav');;
    soundNewDepositorsRoulette = new Audio('/sounds/sound_depositors_roulette.mp3');;
    $(document).on('render', '.selector-timer', function(e, seconds) {
      var $this, min, sec, ten_min, ten_sec;
      $this = $(this);
      ten_min = parseInt(seconds / 60 / 10);
      min = parseInt(seconds / 60 % 10);
      ten_sec = parseInt(seconds % 60 / 10);
      sec = parseInt(seconds % 60 % 10);
      if ('/images/number_' + ten_min + '.png' !== $this.find('.ten_min img:first-child').attr('src')) {
        $this.find('.ten_min img:first-child+img').remove();
        $this.find('.ten_min').prepend('<img class="inserted" src="/images/number_' + ten_min + '.png">');
      }
      if ('/images/number_' + min + '.png' !== $this.find('.min img:first-child').attr('src')) {
        $this.find('.min img:first-child+img').remove();
        $this.find('.min').prepend('<img class="inserted" src="/images/number_' + min + '.png">');
      }
      if ('/images/number_' + ten_sec + '.png' !== $this.find('.ten_sec img:first-child').attr('src')) {
        $this.find('.ten_sec img:first-child+img').remove();
        $this.find('.ten_sec').prepend('<img class="inserted" src="/images/number_' + ten_sec + '.png">');
      }
      if ('/images/number_' + sec + '.png' !== $this.find('.sec img:first-child').attr('src')) {
        $this.find('.sec img:first-child+img').remove();
        $this.find('.sec').prepend('<img class="inserted" src="/images/number_' + sec + '.png">');
      }
      return setTimeout(function() {
        return $this.find('.inserted').removeClass('inserted');
      }, 100);
    });
    $('input').placeholder();
    $(document).on('change', '.checkbox input', function(e) {
      return $(this).toggleClass('checked');
    });
    $(document).on('submit', '#formLanding1', function(e) {
      var validateEmail;
      validateEmail = function(email) {
        var re;
        re = /\S+@\S+\.\S+/;
        return re.test(email);
      };
      if (!validateEmail($(this).find('[type="email"]').val())) {
        alert('Введён неверный адрес электронной почты.');
        return false;
      }
    });
    $(document).on('click', '[rel="sidebar"]', function(e) {
      if (window.sidebar) {
        this.title = document.title;
        if (window.sidebar.addPanel) {
          return window.sidebar.addPanel(document.title, window.location.href, "");
        }
      } else if (window.external && ('AddFavorite' in window.external)) {
        return window.external.AddFavorite(window.location.href, document.title);
      } else if (window.opera && window.print) {
        this.title = document.title;
        return true;
      } else {
        alert('Ваш браузер не позволяет добавить страницу в закладки автоматически.\nНажмите Ctrl+D, чтобы добавить страницу в закладки.');
        return e.preventDefault();
      }
    });
    $(document).on('mouseover', '.history-game-first .row img, .history-game-first .body img, .history-game-last .body img', function(e) {
      return $(this).parent().find('.popover').show();
    });
    $(document).on('mouseout', '.history-game-first .row img, .history-game-first .body img, .history-game-last .body img', function(e) {
      return $(this).parent().find('.popover').hide();
    });
    if (localStorage) {
      localStorage.volumeActive = parseInt(localStorage.volumeActive) ? 1 : 0;
    }
    if (localStorage && parseInt(localStorage.volumeActive)) {
      $('.volume').addClass('active');
    }
    $(document).on('click', '.volume', function(e) {
      if (localStorage) {
        localStorage.volumeActive = 1 - localStorage.volumeActive;
        return $('.volume').toggleClass('active');
      }
    });
    setTimeout(function() {
      return $('.selector-notification-modal').trigger('modal-show', 1000);
    });
    $(document).on('modal-show', '.cgjp-layout .selector-winner-modal, .cgjp-layout .selector-notification-modal', function(e) {
      $(this).show();
      return $(this).find('.modal-dialog .modal-content .body').ellipsis();
    });
    return $(document).on('click', '.cgjp-layout .selector-winner-modal [data-dismiss="modal"], .cgjp-layout .selector-notification-modal [data-dismiss="modal"]', function(e) {
      $(this).closest('.modal').hide();
      return $(this).closest('.modal').trigger('hidden.bs.modal');
    });
  });

}).call(this);

(function() {
  $(function() {
    var currencyMultiplier, flagLayoutEzpzskins;
    flagLayoutEzpzskins = $('html').hasClass('ezpz-layout');
    if (!flagLayoutEzpzskins) {
      return;
    }
    currencyMultiplier = $('body').data('currency-multiplier');
    soundNewMatch = new Audio('/sounds/sound_new_match.wav');;
    soundNewDeposit = new Audio('/sounds/sound_new_deposit.wav');;
    soundNewDepositorsRoulette = new Audio('/sounds/sound_depositors_roulette.mp3');;
    $(document).on('render', '.selector-timer', function(e, seconds) {
      var $this, minutes;
      $this = $(this);
      minutes = parseInt(seconds / 60);
      seconds = seconds % 60;
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return $this.text(minutes + ' : ' + seconds);
    });
    $('.popup').magnificPopup({
      fixedContentPos: false
    });
    $(document).on('focus click', '.main-link', function(e) {
      var $this;
      $this = $(this);
      if ($this.data('ajax-request')) {
        $this.data('ajax-request').abort();
        $this.removeData('ajax-request');
      }
      return $this.data('tradeurl-old', $this.val());
    });
    $(document).on('blur', '.main-link', function(e) {
      var $this, notice, tradeurl;
      notice = $(e.relatedTarget).hasClass('main-link-check');
      $this = $(this);
      tradeurl = $this.val();
      return $this.data('ajax-request', $.ajax({
        url: '/',
        type: 'POST',
        data: {
          tradeurl: tradeurl
        },
        headers: {
          'X-CSRF-TOKEN': $this.data('token')
        },
        success: function() {
          var $notification;
          $this.removeData('tradeurl-old');
          $this.removeData('ajax-request');
          if (notice && tradeurl.length) {
            $notification = $($('.selector-template-notification').text());
            $notification.find('.selector-notification-message').html($this.data('success-message'));
            $notification.find('.ezpz-notification-title').remove();
            $notification.find('br').remove();
            $('body').append($notification);
            return $('.selector-notification-modal').first().trigger('modal-show');
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          if ((xhr.responseJSON != null) && xhr.responseJSON.length) {
            alert(xhr.responseJSON.join("\n"));
          } else if (textStatus !== 'abort') {
            alert('Произошла ошибка при обращении к серверу');
          }
          $this.val($this.data('tradeurl-old'));
          $this.removeData('tradeurl-old');
          return $this.removeData('ajax-request');
        }
      }));
    });
    $(document).on('click', '.selector-profile', function(e) {
      var $this, steamid;
      $this = $(this);
      if ($this.data('ajax-request')) {
        return;
      }
      steamid = $this.data('steamid');
      return $this.data('ajax-request', $.ajax({
        type: 'POST',
        url: '/profile',
        data: {
          steamid: steamid
        },
        success: function(response) {
          var $popup;
          $popup = $(response);
          $.magnificPopup.open({
            items: {
              src: $popup.html(),
              type: 'inline'
            },
            callbacks: {
              open: function() {
                return $(this.content).find('.selector-scrollbar').scrollbar();
              }
            }
          });
          return $this.removeData('ajax-request');
        },
        error: function() {
          alert('Произошла ошибка при выполнении запроса');
          return $this.removeData('ajax-request');
        }
      }));
    });
    $(document).on('modal-show', '.ezpz-layout .selector-winner-modal, .ezpz-layout .selector-notification-modal', function(e) {
      var $this;
      $this = $(this);
      return $.magnificPopup.open({
        items: {
          src: $this.html()
        },
        callbacks: {
          close: function() {
            return setTimeout(function() {
              return $this.trigger('hidden.bs.modal');
            }, 500);
          }
        }
      });
    });
    $(document).on('click', '.selector-reputate', function(e) {
      var $this;
      e.stopPropagation();
      e.preventDefault();
      $this = $(this);
      return $.ajax({
        type: 'POST',
        url: '/reputation',
        data: {
          steamid: $this.data('steamid')
        },
        success: function(response) {
          if (response) {
            $this.remove();
            return $('.selector-reputation').text(1 + parseInt($('.selector-reputation').text()));
          }
        },
        error: function() {
          return alert('Произошла ошибка при выполнении запроса');
        }
      });
    });
    $(document).on('click', '.selector-faircheck', function(e) {
      var hash, random, sum;
      hash = $('.selector-faircheck-hash').val();
      random = $('.selector-faircheck-random').val();
      sum = $('.selector-faircheck-sum').val();
      if (hash.toUpperCase() !== md5(random).toUpperCase()) {
        alert('Введённый хеш раунда не соответствует числу раунда');
        return;
      }
      if ((sum !== String(parseInt(sum))) || (sum <= 0)) {
        alert('Введено неверное число в поле количества копеек в раунде');
        return;
      }
      return alert('Выигрышный билет: ' + parseInt((parseInt(sum / currencyMultiplier)) * (parseFloat(random))));
    });
    if ($('.selector-inventory-loading').size()) {
      $.ajax({
        type: 'POST',
        url: window.location.pathname,
        success: function(response) {
          return $('.selector-inventory-loading').replaceWith(response);
        },
        error: function(xhr, textStatus, errorThrown) {
          if ((xhr.responseJSON != null) && xhr.responseJSON.length) {
            return $('.selector-inventory-loading h6').text(xhr.responseJSON.join("\n")).css('background', 'none');
          } else if (textStatus !== 'abort') {
            return $('.selector-inventory-loading h6').text('Произошла ошибка при обращении к серверу').css('background', 'none');
          }
        }
      });
    }
    return $(document).on('click', '.selector-profile-update', function(e) {
      var $this;
      $this = $(this);
      if ($this.hasClass('loading')) {
        return;
      }
      $this.addClass('loading');
      return $.ajax({
        type: 'POST',
        url: '/profile-update',
        success: function(response) {
          $this.find('img').attr('src', response.steamavatarfull);
          $('.selector-profile-steampersonaname').text(response.steampersonaname);
          return $this.removeClass('loading');
        },
        error: function(xhr, textStatus, errorThrown) {
          return $this.removeClass('loading');
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map