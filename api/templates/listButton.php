<div class="row listButton<?php echo $statusClass; ?>" id="<?php echo $id; ?>">
  <div class="row primary">
    <div class="buttonCell col-xs-3 col-md-1">
      <span class="icon"><i class="<?php echo $statusIcon; ?> fa-3x"></i></span>
    </div>
    <div class="buttonCell name col-xs-9 col-md-3">
      <?php if ( $underAge ): ?>
      <span class="underage">
        <i class='fas fa-child fa-3x'></i>
      </span>
      <?php endif; ?>
      <?php if ( isset($crew) ): ?>
      <span class="crew">
        <?php echo $crew;?>
      </span>
    <?php endif; ?>
      <span class="first"><?php echo $first; ?>&nbsp;</span>
      <span class="last"><?php echo $last; ?></span>
    </div>
    <div class="buttonCell col-md-2 visible-md visible-lg">
      Order:&nbsp;
      <a href="<?php echo $orderLink; ?>" target="_blank">
        <span class="orderNum"><?php echo $orderNum; ?></span>
      </a>
    </div>
    <?php if ( $pickup ): ?>
    <div class="buttonCell col-xs-9 col-md-2 flexPickup<?php echo $pickupVisible; ?>">
      <?php echo $pickupName; ?>
    </div>
  <?php endif; ?>

    <div class="buttonCell col-xs-9 col-md-3 flexPackage<?php echo $packageVisible; ?>">
      <?php echo $package; ?>
    </div>
    <div class="buttonCell col-xs-3 col-md-offset-0 col-md-1 expand">
      <i class="fas fa-bars fa-3x"></i>
    </div>
  </div>
  <div class="row">
    <?php if ( isset($toBeach) ): ?>
      <div class="col-md-offset-1 col-md-4">
        To Beach: <?php echo $toBeach; ?>
      </div>
    <?php endif; ?>
    <?php if ( isset($fromBeach) ): ?>
      <div class="col-md-4">
        From Beach: <?php echo $fromBeach; ?>
      </div>
    <?php endif; ?>
  </div>
  <div class="row">
    <?php if ( isset( $tertiary_label ) ): ?>
      <div class="col-md-4 col-md-offset-1">
        <?php echo "<strong>{$tertiary_label}</strong>: {$tertiary}";?>
    <?php endif;?>
  </div>
  <div class="expanded">
    <div class="row">
      <div class="buttonCell col-xs-5 col-md-6">
        <strong>Package: </strong><?php echo $package; ?>
      </div>
      <?php if ( $pickup ): ?>
      <div class="buttonCell col-xs-12 col-md-6">
        <strong>Pickup: </strong><?php echo $pickupName; ?>
      </div>
    <?php endif; ?>
    </div>
    <div class="row">
      <div class="buttonCell col-xs-12 col-md-6">
        <strong>Order: </strong>
        <a href="<?php echo $orderLink; ?>">
          <?php echo $orderNum; ?>
        </a>
      </div>
      <div class="buttonCell col-xs-12 col-md-6">
        <strong>Phone: </strong>
        <a href="tel:<?php echo $phone; ?>">
          <span class="phone"><?php echo $phone; ?></span>
        </a>
      </div>
    </div>
    <div class="row">
      <?php if ( isset($email) && "" !== $email ): ?>
      <div class="buttonCell col-xs-12 col-md-6">
        <strong>Email: </strong>
        <a href="mailto:<?php echo $email; ?>">
          <span class="email"><?php echo $email; ?></span>
        </a>
      </div>
      <?php endif; ?>
      <?php if ( isset($crew) ) : ?>
      <div class="buttonCell col-xs-12 col-md-6">
          <?php echo $crew; ?>
      </div>
      <?php endif; ?>
    </div>
    <div class="row">
      <br />
      <div class="buttonCell col-xs-4">
        <button class="btn btn-info reset" id="<?php echo $id; ?>:Reset">
          Reset
        </button>
      </div>
      <div class="buttonCell col-xs-4">
        <button class="btn btn-warning noShow" id="<?php echo $id; ?>:NoShow">
          No Show
        </button>
      </div>
      <?php if ( $walkOn ): ?>
        <div class="buttonCell col-xs-4">
            <button class="btn btn-danger removeOrder" id="<?php echo $id; ?>:Delete">
                Remove Order
            </button>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>
